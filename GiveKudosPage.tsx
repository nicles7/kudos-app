import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { KudosType, Role } from '../types';
import Notification from '../components/Notification';
import StarIcon from '../components/icons/StarIcon';
import { GoogleGenAI, Modality } from '@google/genai';
import SparklesIcon from '../components/icons/SparklesIcon';
import ImageIcon from '../components/icons/ImageIcon';

const GiveKudosPage: React.FC = () => {
  const { user } = useAuth();
  const { users, kudos, addKudos, getKudosLimits, getTeamMembers } = useData();
  
  const [kudosType, setKudosType] = useState<KudosType>(KudosType.Silver);
  const [recipientId, setRecipientId] = useState<string>('');
  const [message, setMessage] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageCorrectionPrompt, setImageCorrectionPrompt] = useState('');

  const { silverRemaining, goldRemaining } = useMemo(() => {
    if (!user) return { silverRemaining: 0, goldRemaining: 0 };
    return getKudosLimits(user.id);
  }, [user, getKudosLimits, kudos]);

  const teamMembers = useMemo(() => {
      if (!user || user.role !== Role.TeamLead) return [];
      return getTeamMembers(user.id);
  }, [user, getTeamMembers]);

  const recipientOptions = useMemo(() => {
    if (kudosType === KudosType.Gold) {
      return teamMembers;
    }
    return users.filter(u => u.id !== user?.id);
  }, [kudosType, users, user, teamMembers]);

  useEffect(() => {
    if (recipientOptions.length > 0) {
        setRecipientId(recipientOptions[0].id);
    } else {
        setRecipientId('');
    }
  }, [recipientOptions]);

  const canSubmit = useMemo(() => {
    if (!recipientId || !message.trim()) return false;
    if (kudosType === KudosType.Silver) return silverRemaining > 0;
    if (kudosType === KudosType.Gold) return goldRemaining > 0;
    return false;
  }, [recipientId, message, kudosType, silverRemaining, goldRemaining]);
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !canSubmit) return;

    addKudos({
      senderId: user.id,
      receiverId: recipientId,
      type: kudosType,
      message,
      imageBase64: imageBase64,
    });

    setNotification({ message: 'Kudos sent successfully!', type: 'success' });
    setMessage('');
    setImageBase64(null);
    setImageCorrectionPrompt('');
    setRecipientId(recipientOptions.length > 0 ? recipientOptions[0].id : '');
  };

  const handleGenerateMessage = async () => {
    if (!recipientId || !user) {
      setNotification({ message: 'Please select a recipient first.', type: 'error' });
      return;
    }

    const recipient = users.find(u => u.id === recipientId);
    if (!recipient) return;

    setIsGenerating(true);
    setNotification(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = message.trim()
        ? `Write a short, friendly, and professional kudos message from ${user.name} to ${recipient.name}, inspired by these keywords: "${message}". Please provide only the message text itself, without any subject line, greeting, or extra commentary.`
        : `Write a short, friendly, and professional kudos message from ${user.name} to ${recipient.name} to recognize their great work. Please provide only the message text itself, without any subject line, greeting, or extra commentary.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      setMessage(response.text.trim());

    } catch (error) {
      console.error("Error generating kudos message:", error);
      setNotification({ message: 'AI failed to generate a message. Please try again.', type: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!message.trim()) {
      setNotification({ message: 'Please write a message first to generate a relevant image.', type: 'error' });
      return;
    }
    if (!user || !recipientId) {
        setNotification({ message: 'Please select a recipient.', type: 'error' });
        return;
    }
    const recipient = users.find(u => u.id === recipientId);
    if (!recipient) {
        setNotification({ message: 'Recipient not found.', type: 'error' });
        return;
    }

    setIsGeneratingImage(true);
    setNotification(null);
    setImageBase64(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      
      let roleBasedVisuals = '';
      switch (recipient.role) {
        case Role.TeamLead:
          roleBasedVisuals = 'incorporate themes of leadership, guidance, and teamwork, like a compass, a guiding star, or a strong tree with branches.';
          break;
        case Role.HR:
          roleBasedVisuals = 'incorporate themes of support, growth, and community, like helping hands, a flourishing plant, or interconnected gears.';
          break;
        case Role.Employee:
        default:
          roleBasedVisuals = 'incorporate themes of collaboration, innovation, and dedication, like puzzle pieces coming together, a bright lightbulb, or climbing a mountain.';
          break;
      }

      const prompt = `Create a visually stunning digital art illustration for an employee recognition award certificate. It must clearly display: "Awarded To: ${recipient.name}", "Awarded By: ${user.name}", "Date: ${currentDate}", and the core message: "${message}". The visual theme should be inspired by the message and the recipient's role as a ${recipient.role}. For a ${recipient.role}, ${roleBasedVisuals} The style should be professional and celebratory, with text artistically integrated into the design.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });
      
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setImageBase64(part.inlineData.data);
          break;
        }
      }

    } catch (error) {
      console.error("Error generating kudos image:", error);
      setNotification({ message: 'AI failed to generate an image. Please try again.', type: 'error' });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleRegenerateImage = async () => {
    if (!imageCorrectionPrompt.trim()) {
      setNotification({ message: 'Please enter a correction prompt.', type: 'error' });
      return;
    }
    if (!imageBase64) {
      setNotification({ message: 'No image to correct. Generate an image first.', type: 'error' });
      return;
    }

    setIsGeneratingImage(true);
    setNotification(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: imageBase64,
                mimeType: 'image/png',
              },
            },
            { text: imageCorrectionPrompt },
          ],
        },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });
      
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setImageBase64(part.inlineData.data);
          break;
        }
      }
      setImageCorrectionPrompt('');

    } catch (error) {
      console.error("Error regenerating kudos image:", error);
      setNotification({ message: 'AI failed to regenerate the image. Please try again.', type: 'error' });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto">
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Give Kudos</h2>
        <p className="text-gray-500 mb-6">Recognize your colleagues for their awesome work!</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-center">
            <div className={`p-4 border-2 rounded-lg ${silverRemaining > 0 ? 'border-gray-300' : 'border-gray-200 bg-gray-50 text-gray-400'}`}>
                <p className="font-semibold">Silver Kudos Remaining</p>
                <p className="text-3xl font-bold text-gray-500">{silverRemaining}</p>
            </div>
             {user.role === Role.TeamLead && (
                <div className={`p-4 border-2 rounded-lg ${goldRemaining > 0 ? 'border-yellow-400' : 'border-gray-200 bg-gray-50 text-gray-400'}`}>
                    <p className="font-semibold">Gold Kudos Remaining</p>
                    <p className="text-3xl font-bold text-yellow-500">{goldRemaining}</p>
                </div>
            )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Kudos Type</label>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button type="button" onClick={() => setKudosType(KudosType.Silver)} className={`flex items-center justify-center p-4 rounded-lg border-2 ${kudosType === KudosType.Silver ? 'border-teal-500 bg-teal-50' : 'border-gray-300 bg-white'}`}>
                <StarIcon className="w-6 h-6 text-gray-400 mr-2" />
                <span className="font-semibold">Silver</span>
              </button>
              {user.role === Role.TeamLead && (
                 <button type="button" onClick={() => setKudosType(KudosType.Gold)} className={`flex items-center justify-center p-4 rounded-lg border-2 ${kudosType === KudosType.Gold ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300 bg-white'}`}>
                    <StarIcon className="w-6 h-6 text-yellow-500 mr-2" />
                    <span className="font-semibold">Gold</span>
                 </button>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">Recipient</label>
            <select
              id="recipient"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
              disabled={recipientOptions.length === 0}
            >
              {recipientOptions.length > 0 ? (
                recipientOptions.map(u => <option key={u.id} value={u.id}>{u.name}</option>)
              ) : (
                <option>No eligible recipients</option>
              )}
            </select>
             {kudosType === KudosType.Gold && <p className="text-xs text-gray-500 mt-1">As a Team Lead, you can only give Gold Kudos to your team members.</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
               <button
                  type="button"
                  onClick={handleGenerateMessage}
                  disabled={!recipientId || isGenerating}
                  className="flex items-center space-x-1.5 text-sm font-medium text-teal-600 hover:text-teal-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                  aria-label="Generate kudos message with AI"
              >
                  {isGenerating ? (
                      <>
                          <svg className="animate-spin h-4 w-4 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Generating...</span>
                      </>
                  ) : (
                      <>
                          <SparklesIcon className="w-4 h-4" />
                          <span>Generate with AI</span>
                      </>
                  )}
              </button>
            </div>
            <textarea
              id="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter keywords about their achievement, then click 'Generate with AI' to expand."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Add an Image (Optional)</label>
            <div className="mt-2 p-4 border-2 border-dashed rounded-lg bg-gray-50">
              {isGeneratingImage ? (
                <div className="py-4 text-center">
                  <svg className="animate-spin h-8 w-8 text-teal-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">Generating a unique image for your kudos...</p>
                </div>
              ) : imageBase64 ? (
                <div className="space-y-4">
                    <div className="relative group">
                        <img src={`data:image/png;base64,${imageBase64}`} alt="Generated Kudos Image" className="rounded-lg w-full object-cover max-h-64 mx-auto" />
                        <button 
                            type="button" 
                            onClick={() => { setImageBase64(null); setImageCorrectionPrompt(''); }} 
                            className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                            aria-label="Remove image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div>
                        <label htmlFor="correction" className="block text-sm font-medium text-gray-700">Image Correction</label>
                        <div className="mt-1 flex gap-2">
                            <input
                                id="correction"
                                type="text"
                                value={imageCorrectionPrompt}
                                onChange={(e) => setImageCorrectionPrompt(e.target.value)}
                                className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                placeholder="e.g., 'Make the background blue'"
                                disabled={isGeneratingImage}
                            />
                            <button
                                type="button"
                                onClick={handleRegenerateImage}
                                disabled={isGeneratingImage || !imageCorrectionPrompt.trim()}
                                className="inline-flex items-center space-x-1.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:text-white disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors px-3 py-2 rounded-md"
                                aria-label="Regenerate kudos image with AI"
                            >
                                 <SparklesIcon className="w-4 h-4" />
                                 <span>Regenerate</span>
                            </button>
                        </div>
                    </div>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Generate a personalized award image.</p>
                  <button
                      type="button"
                      onClick={handleGenerateImage}
                      disabled={isGeneratingImage || !message.trim()}
                      className="mt-3 inline-flex items-center space-x-1.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:text-white disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors px-4 py-2 rounded-md"
                      aria-label="Generate kudos image with AI"
                  >
                      <SparklesIcon className="w-4 h-4" />
                      <span>Generate Image</span>
                  </button>
                  <p className="text-xs text-gray-500 mt-2">The recipient's name, date, and your name will be automatically included.</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Send Kudos
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GiveKudosPage;
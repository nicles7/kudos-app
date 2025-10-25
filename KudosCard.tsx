import React from 'react';
import { Kudos, KudosType, User } from './types';
import StarIcon from './StarIcon';
import { useData } from './DataContext';

interface KudosCardProps {
  kudos: Kudos;
}

const KudosCard: React.FC<KudosCardProps> = ({ kudos }) => {
  const { users } = useData();
  const sender = users.find(u => u.id === kudos.senderId);
  const receiver = users.find(u => u.id === kudos.receiverId);

  if (!sender || !receiver) return null;

  const isGold = kudos.type === KudosType.Gold;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-teal-500 flex space-x-4">
      <div className="flex-shrink-0">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
          isGold ? 'bg-yellow-100' : 'bg-gray-200'
        }`}>
          <StarIcon className={`w-8 h-8 ${
            isGold ? 'text-yellow-500' : 'text-gray-400'
          }`} />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
            <div>
                <p className="font-semibold text-gray-800">
                    <span className="font-normal">From:</span> {sender.name}
                </p>
                <p className="font-semibold text-gray-800">
                    <span className="font-normal">To:</span> {receiver.name}
                </p>
            </div>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                isGold ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-800'
            }`}>
                {kudos.type} Kudos
            </span>
        </div>
        <p className="mt-2 text-gray-600 italic bg-gray-50 p-3 rounded-md">"{kudos.message}"</p>
        
        {kudos.imageBase64 && (
          <div className="mt-3 rounded-lg overflow-hidden border">
            <img
              src={kudos.imageBase64}
              alt="Kudos Illustration"
              className="w-full object-cover"
            />
          </div>
        )}

        <p className="text-right text-xs text-gray-400 mt-2">
            {new Date(kudos.timestamp).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default KudosCard;

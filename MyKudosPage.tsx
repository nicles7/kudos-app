import React, { useState, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { useData } from './DataContext';
import KudosCard from './KudosCard';

type Tab = 'received' | 'given';

const MyKudosPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('received');
  const { user } = useAuth();
  const { kudos } = useData();

  const filteredKudos = useMemo(() => {
    if (!user) return [];

    if (activeTab === 'received') {
      return kudos.filter(k => k.receiverId === user.id);
    }
    return kudos.filter(k => k.senderId === user.id);
  }, [activeTab, user, kudos]);

  const tabClasses = (tabName: Tab) => 
    `px-4 py-2 font-semibold rounded-md transition-colors duration-200 ${
        activeTab === tabName ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-200'
    }`;

  return (
    <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Kudos</h2>
        
        <div className="bg-white p-2 rounded-lg shadow-sm mb-6 inline-flex space-x-2">
            <button onClick={() => setActiveTab('received')} className={tabClasses('received')}>
                Received Kudos
            </button>
            <button onClick={() => setActiveTab('given')} className={tabClasses('given')}>
                Given Kudos
            </button>
        </div>

        <div className="space-y-4">
            {filteredKudos.length > 0 ? (
                filteredKudos.map(k => <KudosCard key={k.id} kudos={k} />)
            ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500">No kudos to display here yet.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default MyKudosPage;

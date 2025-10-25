import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, Team, Kudos, KudosType, Role } from './types';
import { users as initialUsers, teams as initialTeams, kudos as initialKudos } from './data';
import { useAuth } from './AuthContext';

interface DataContextType {
  users: User[];
  teams: Team[];
  kudos: Kudos[];
  addKudos: (kudos: Omit<Kudos, 'id' | 'timestamp'>) => void;
  getKudosLimits: (userId: string) => {
    silverGiven: number;
    silverRemaining: number;
    goldGiven: number;
    goldRemaining: number;
    goldLimit: number;
  };
  getTeamMembers: (teamLeadId: string) => User[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [kudos, setKudos] = useState<Kudos[]>(initialKudos);

  const addKudos = (newKudos: Omit<Kudos, 'id' | 'timestamp'>) => {
    const kudosToAdd: Kudos = {
      ...newKudos,
      id: `k${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setKudos(prevKudos => [kudosToAdd, ...prevKudos]);
  };

  const getTeamMembers = (teamLeadId: string): User[] => {
    const lead = users.find(u => u.id === teamLeadId);
    if (!lead || lead.role !== Role.TeamLead) return [];
    return users.filter(u => u.teamId === lead.teamId && u.id !== teamLeadId);
  };

  const getKudosLimits = (userId: string) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentUser = users.find(u => u.id === userId);
    const givenKudosThisMonth = kudos.filter(
      k => k.senderId === userId && new Date(k.timestamp) >= startOfMonth
    );
    const silverGiven = givenKudosThisMonth.filter(k => k.type === KudosType.Silver).length;
    const goldGiven = givenKudosThisMonth.filter(k => k.type === KudosType.Gold).length;
    const silverLimit = 2;
    
    let goldLimit = 0;
    if (currentUser?.role === Role.TeamLead) {
        const teamMembersCount = getTeamMembers(userId).length;
        if (teamMembersCount >= 1 && teamMembersCount <= 3) goldLimit = 1;
        else if (teamMembersCount >= 4 && teamMembersCount <= 5) goldLimit = 2;
        else if (teamMembersCount >= 6 && teamMembersCount <= 7) goldLimit = 3;
        else if (teamMembersCount >= 8) goldLimit = 4;
    }

    return {
      silverGiven,
      silverRemaining: silverLimit - silverGiven,
      goldGiven,
      goldLimit,
      goldRemaining: goldLimit - goldGiven,
    };
  };

  return (
    <DataContext.Provider value={{ users, teams, kudos, addKudos, getKudosLimits, getTeamMembers }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

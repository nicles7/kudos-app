import React, { useMemo, useState } from 'react';
import { useData } from './DataContext';
import { User, Kudos, Team, KudosType } from './types';
import KudosCard from './KudosCard';
import TrophyIcon from './TrophyIcon';
interface LeaderboardEntry {
  user: User;
  kudosCount: number;
  goldCount: number;
  silverCount: number;
}
const LeaderboardPage: React.FC = () => {
  const { users, kudos, teams } = useData();
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const kudosThisMonth = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return kudos.filter(k => new Date(k.timestamp) >= startOfMonth);
  }, [kudos]);
  const leaderboardData = useMemo(() => {
    const kudosCounts = new Map<string, { gold: number; silver: number }>();
    const filteredKudos = selectedTeam === 'all'
      ? kudosThisMonth
      : kudosThisMonth.filter(k => {
          const receiver = users.find(u => u.id === k.receiverId);
          return receiver?.teamId === selectedTeam;
        });
    filteredKudos.forEach(k => {
      const counts = kudosCounts.get(k.receiverId) || { gold: 0, silver: 0 };
      if (k.type === KudosType.Gold) {
        counts.gold += 1;
      } else {
        counts.silver += 1;
      }
      kudosCounts.set(k.receiverId, counts);
    });
    const data: LeaderboardEntry[] = Array.from(kudosCounts.entries())
      .map(([userId, counts]) => {
        const user = users.find(u => u.id === userId);
        return user ? {
          user,
          kudosCount: counts.gold * 2 + counts.silver, // Gold kudos are worth more
          goldCount: counts.gold,
          silverCount: counts.silver,
        } : null;
      })
      .filter((entry): entry is LeaderboardEntry => entry !== null)
      .sort((a, b) => b.kudosCount - a.kudosCount || b.goldCount - a.goldCount);
    return data;
  }, [kudosThisMonth, users, selectedTeam]);
  
  const employeeOfTheMonth = leaderboardData.length > 0 ? leaderboardData[0] : null;
  const recentKudos = [...kudosThisMonth].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);
  
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Monthly Leaderboard</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Top Kudos Receivers</h3>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-600" htmlFor="team-filter">Filter by team:</label>
              <select
                id="team-filter"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="block pl-3 pr-8 py-1 text-sm border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 rounded-md"
              >
                <option value="all">All Teams</option>
                {teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
            {leaderboardData.length > 0 ? leaderboardData.slice(0, 10).map((entry, index) => (
              <div key={entry.user.id} className={`p-4 rounded-lg flex items-center space-x-4 ${index === 0 ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-teal-500' : 'bg-gray-50'}`}>
                <span className={`w-8 text-center text-xl font-bold ${index === 0 ? 'text-teal-600' : 'text-gray-400'}`}>{index + 1}</span>
                <img src={entry.user.avatar} alt={entry.user.name} className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{entry.user.name}</p>
                  <p className="text-sm text-gray-500">{teams.find(t => t.id === entry.user.teamId)?.name}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg text-teal-600">{entry.kudosCount} Points</p>
                    <p className="text-xs text-gray-500">{entry.goldCount} Gold, {entry.silverCount} Silver</p>
                </div>
              </div>
            )) : <p className="text-center text-gray-500 py-8">No kudos given this month yet.</p>}
          </div>
        </div>
        <div className="space-y-8">
          {employeeOfTheMonth && (
            <div className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white p-6 rounded-xl shadow-lg text-center">
                <TrophyIcon className="w-12 h-12 mx-auto text-yellow-300" />
                <h3 className="text-xl font-bold mt-2">Employee of the Month!</h3>
                <img src={employeeOfTheMonth.user.avatar} alt={employeeOfTheMonth.user.name} className="w-24 h-24 rounded-full mx-auto my-4 ring-4 ring-white" />
                <p className="text-2xl font-semibold">{employeeOfTheMonth.user.name}</p>
                <p className="opacity-80">{teams.find(t => t.id === employeeOfTheMonth.user.teamId)?.name}</p>
                <p className="mt-2 text-3xl font-bold">{employeeOfTheMonth.kudosCount} Points</p>
            </div>
          )}
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Shout-out Wall</h3>
            <div className="space-y-4">
              {recentKudos.length > 0 ? recentKudos.map(k => (
                <KudosCard key={k.id} kudos={k} />
              )) : <p className="text-center text-gray-500 py-4">Waiting for the first shout-out of the month...</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LeaderboardPage;

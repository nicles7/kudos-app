import React, { useMemo } from 'react';
import { useData } from './DataContext';
import StatCard from './StatCard';
import { KudosType } from './types';
import GiftIcon from './GiftIcon';
import StarIcon from './StarIcon';
import UserCircleIcon from './UserCircleIcon';
const AdminDashboardPage: React.FC = () => {
    const { users, teams, kudos } = useData();
    const stats = useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const kudosThisMonth = kudos.filter(k => new Date(k.timestamp) >= startOfMonth);
        const totalSent = kudosThisMonth.length;
        const silverSent = kudosThisMonth.filter(k => k.type === KudosType.Silver).length;
        const goldSent = kudosThisMonth.filter(k => k.type === KudosType.Gold).length;
        return {
            totalSent,
            silverSent,
            goldSent,
            totalUsers: users.length,
        };
    }, [kudos, users]);
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Kudos This Month" 
                    value={stats.totalSent} 
                    icon={<GiftIcon className="w-6 h-6" />}
                    color="bg-teal-100 text-teal-600" 
                />
                <StatCard
                    title="Silver Kudos Sent" 
                    value={stats.silverSent} 
                    icon={<StarIcon className="w-6 h-6" />}
                    color="bg-gray-200 text-gray-600" 
                />
                <StatCard
                    title="Gold Kudos Sent" 
                    value={stats.goldSent} 
                    icon={<StarIcon className="w-6 h-6" />}
                    color="bg-yellow-100 text-yellow-600" 
                />
                <StatCard
                    title="Total Employees" 
                    value={stats.totalUsers} 
                    icon={<UserCircleIcon className="w-6 h-6" />}
                    color="bg-blue-100 text-blue-600" 
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Employee Management</h3>
                    <div className="overflow-x-auto max-h-96">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">Role</th>
                                    <th scope="col" className="px-6 py-3">Team</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center space-x-3">
                                            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">{user.role}</td>
                                        <td className="px-6 py-4">{teams.find(t => t.id === user.teamId)?.name || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Team Management</h3>
                     <div className="overflow-x-auto max-h-96">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Team Name</th>
                                    <th scope="col" className="px-6 py-3">Team Lead</th>
                                    <th scope="col" className="px-6 py-3">Members</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teams.map(team => {
                                    const lead = users.find(u => u.id === team.leadId);
                                    const memberCount = users.filter(u => u.teamId === team.id).length;
                                    return (
                                        <tr key={team.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{team.name}</td>
                                            <td className="px-6 py-4">{lead?.name || 'N/A'}</td>
                                            <td className="px-6 py-4">{memberCount}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AdminDashboardPage;

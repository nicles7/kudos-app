
import { User, Team, Kudos, Role, KudosType } from './types';

export const users: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@ecgroup.com', role: Role.TeamLead, teamId: 'A', managerId: null, avatar: 'https://picsum.photos/seed/alice/100/100' },
  { id: '2', name: 'Bob Williams', email: 'bob@ecgroup.com', role: Role.Employee, teamId: 'A', managerId: '1', avatar: 'https://picsum.photos/seed/bob/100/100' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@ecgroup.com', role: Role.Employee, teamId: 'A', managerId: '1', avatar: 'https://picsum.photos/seed/charlie/100/100' },
  { id: '4', name: 'Diana Miller', email: 'diana@ecgroup.com', role: Role.TeamLead, teamId: 'B', managerId: null, avatar: 'https://picsum.photos/seed/diana/100/100' },
  { id: '5', name: 'Ethan Davis', email: 'ethan@ecgroup.com', role: Role.Employee, teamId: 'B', managerId: '4', avatar: 'https://picsum.photos/seed/ethan/100/100' },
  { id: '6', name: 'Fiona Garcia', email: 'fiona@ecgroup.com', role: Role.Employee, teamId: 'B', managerId: '4', avatar: 'https://picsum.photos/seed/fiona/100/100' },
  { id: '7', name: 'George Rodriguez', email: 'george@ecgroup.com', role: Role.Employee, teamId: 'B', managerId: '4', avatar: 'https://picsum.photos/seed/george/100/100' },
  { id: '8', name: 'Hannah Wilson', email: 'hannah@ecgroup.com', role: Role.HR, teamId: 'C', managerId: null, avatar: 'https://picsum.photos/seed/hannah/100/100' },
  { id: '9', name: 'Ian Martinez', email: 'ian@ecgroup.com', role: Role.Employee, teamId: 'A', managerId: '1', avatar: 'https://picsum.photos/seed/ian/100/100' },
  { id: '10', name: 'Jane Smith', email: 'jane@ecgroup.com', role: Role.Employee, teamId: 'B', managerId: '4', avatar: 'https://picsum.photos/seed/jane/100/100' },
];

export const teams: Team[] = [
  { id: 'A', name: 'Alpha Team', leadId: '1' },
  { id: 'B', name: 'Bravo Team', leadId: '4' },
  { id: 'C', name: 'HR Department', leadId: '8' },
];

const now = new Date();
const lastMonth = new Date();
lastMonth.setMonth(now.getMonth() - 1);

export const kudos: Kudos[] = [
  { id: 'k1', senderId: '2', receiverId: '1', type: KudosType.Silver, message: 'Great leadership on the last project!', timestamp: new Date().toISOString() },
  { id: 'k2', senderId: '3', receiverId: '2', type: KudosType.Silver, message: 'Always so helpful and positive. Thanks for the support!', timestamp: new Date(now.setDate(now.getDate() - 2)).toISOString() },
  { id: 'k3', senderId: '1', receiverId: '3', type: KudosType.Gold, message: 'Exceptional work on the client presentation. You nailed it!', timestamp: new Date(now.setDate(now.getDate() - 3)).toISOString() },
  { id: 'k4', senderId: '5', receiverId: '4', type: KudosType.Silver, message: 'Thanks for being a great mentor.', timestamp: new Date(now.setDate(now.getDate() - 5)).toISOString() },
  { id: 'k5', senderId: '4', receiverId: '5', type: KudosType.Gold, message: 'Your dedication to quality is inspiring. Keep it up!', timestamp: new Date(now.setDate(now.getDate() - 6)).toISOString() },
  { id: 'k6', senderId: '6', receiverId: '7', type: KudosType.Silver, message: 'Team player of the month!', timestamp: new Date(now.setDate(now.getDate() - 10)).toISOString() },
  { id: 'k7', senderId: '8', receiverId: '1', type: KudosType.Silver, message: 'Excellent collaboration with HR.', timestamp: lastMonth.toISOString() },
  { id: 'k8', senderId: '1', receiverId: '2', type: KudosType.Gold, message: 'Amazing problem-solving skills shown this month.', timestamp: new Date(now.setDate(now.getDate() - 1)).toISOString() },
];

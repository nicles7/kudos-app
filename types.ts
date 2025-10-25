export enum Role {
  Employee = 'Employee',
  TeamLead = 'TeamLead',
  HR = 'HR',
}

export enum KudosType {
  Silver = 'Silver',
  Gold = 'Gold',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  teamId: string;
  managerId: string | null;
  avatar: string;
}

export interface Team {
  id: string;
  name: string;
  leadId: string;
}

export interface Kudos {
  id: string;
  senderId: string;
  receiverId: string;
  type: KudosType;
  message: string;
  timestamp: string;
  imageBase64?: string;
}
// src/types/user.ts
export enum RoleEnum {
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
  LEADER = "LEADER",
  TRAINER = "TRAININGSTAFF",
  MANAGER = "MANAGER",
}

export interface User {
  id: string;
  email: string;
  name: string;
  full_name: string;
  avatar?: string;
  role: RoleEnum;
  createdAt: string;
  updatedAt: string;
}

// src/types/user.ts
export enum RoleEnum {
  ADMIN = "admin",
  EMPLOYEE = "employee",
  LEADER = "leader",
  TRAINER = "trainer",
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

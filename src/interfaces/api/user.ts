import { Department } from "./department";
import { Metric } from "./metric";

export enum RoleEnum {
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
  LEADER = "LEADER",
  TRAINER = "TRAINING STAFF",
}

export interface User {
  id: string;
  employee_code?: string;
  dept_name: string;
  email: string;
  full_name: string;
  avatar?: string;
  role: RoleEnum;
  role_id?: string;
  password?: string;
  department_id?: string;
  status: string;
  department: Department;
  avatar_url?: string;
  metrics?: Metric[];
}

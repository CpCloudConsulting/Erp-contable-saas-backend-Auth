import { StringValue } from "ms";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: StringValue;
  user: Users;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface Users {
  id: string;
  companyId: string;
  email: string;
  name: string;
  sedeId: string;
  roles: string[];
}

export interface UsersDTO {
  id: string;
  email: string;
  password: string;
  active: string;
  name: string;
  sedeId: string;
  roles: string[];
}

export interface UsersResponse {
  id: string;
  email: string;
  username: string;
  active: string;
  name: string;
  phone: string;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  active: string;
  name: string;
  roles: string[];
}

export interface CreateUserResponse {
  id: string;
  email: string;
  username: string;
  active: string;
  name: string;
  roles: string[];
}

export interface CreateUserEntity {
  email: string;
  username: string;
  password: string;
  active: boolean;
  name: string;
  phone:string;
}

export interface RolesResponse {
  id: string;
  name: string;
  description: string;
}

export interface CreateRolesEntity {
  name: string;
  description: string;
}
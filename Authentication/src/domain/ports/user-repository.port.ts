import { CreateUserEntity, UsersDTO, UsersResponse } from "../models/login.models";

export interface UserRepositoryPort {

  findByEmail(email: string): Promise<boolean>;
  create(user: CreateUserEntity, hash: string): Promise<UsersResponse>;
  findByUsername(username: string): Promise<UsersDTO | null>;
}
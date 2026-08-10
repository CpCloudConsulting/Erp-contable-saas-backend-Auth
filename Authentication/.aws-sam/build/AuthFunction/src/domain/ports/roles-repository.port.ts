import { CreateRolesEntity, RolesResponse } from "../models/login.models";

export interface RolesRepositoryPort {

  assignRoles(userId: string, roles: string[]): Promise<void>;
  create(roles: CreateRolesEntity): Promise<RolesResponse>;
  findByRolename(name: string): Promise<boolean>;
}
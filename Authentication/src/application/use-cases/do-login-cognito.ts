import { LoginResponse } from "../../domain/entities/loginResponse";
import { User } from "../../domain/entities/User";
import { UserRepository } from "../../infrastructure/persistence/UserRepository";

export class DoLogin {
  constructor(private repo: UserRepository) {}

  async execute(data: User): Promise<LoginResponse> {
    return this.repo.DoLogin(data);
  }
}
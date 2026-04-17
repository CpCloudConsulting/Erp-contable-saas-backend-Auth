import { Cognito } from "../../domain/entities/cognito";
import { User } from "../../domain/entities/User";
import { UserRepository } from "../../infrastructure/persistence/UserRepository";

export class CreateUser {
  constructor(private repo: UserRepository) {}

  async execute(data: User): Promise<Cognito> {
    console.log("Creating user with data:", data);
    return this.repo.CreateUser(data);
  }
}
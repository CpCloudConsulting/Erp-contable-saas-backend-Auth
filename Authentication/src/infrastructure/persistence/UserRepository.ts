import { UserRepositoryPort } from "../../domain/repositories/UserRepositoryPort";
import { User } from "../../domain/entities/User";
import { CognitoPort } from "../../domain/repositories/cognitoRepositoryPort";
import { LoginResponse } from "../../domain/entities/loginResponse";

export class UserRepository implements UserRepositoryPort {

  constructor(private cognitoUserService: CognitoPort) {}

  async CreateUser(user: User) {
    const result = await this.cognitoUserService.create(user.email, user.password);
    return result;
  }

  async DoLogin(user: User): Promise<LoginResponse> {
    const result = await this.cognitoUserService.doLogin(user.email, user.password);
    return result;
  }



}
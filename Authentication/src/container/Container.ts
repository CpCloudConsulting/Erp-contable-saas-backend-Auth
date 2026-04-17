import { UserRepository } from "../infrastructure/persistence/UserRepository";
import { CreateUser } from "../application/use-cases/create-user-cognito";
import { CognitoService } from "../infrastructure/aws/cognito";
import { DoLogin } from "../application/use-cases/do-login-cognito";


export class Container {
  private cognito = new CognitoService();
  private userRepository = new UserRepository(this.cognito);
  
  createUser = new CreateUser(this.userRepository);
  doLogin = new DoLogin(this.userRepository);

}
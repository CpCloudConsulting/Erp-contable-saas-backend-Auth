import { User } from "../entities/User";
import { Cognito } from "../entities/cognito";
import { LoginResponse } from "../entities/loginResponse";

export interface UserRepositoryPort {

  /**
   * Crear un usuario en Cognito con el email y password proporcionados, y retornar el sub de Cognito como resultado.
   */
  CreateUser(user: User): Promise<Cognito>;

  DoLogin(user: User): Promise<LoginResponse>;


}
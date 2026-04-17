import { LoginResponse } from "../entities/loginResponse";

export interface CognitoPort {

  create(email: string, password: string): Promise<{ cognito_sub: string }>;

  doLogin(email: string, password: string): Promise<LoginResponse>;
  
}
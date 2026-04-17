import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminGetUserCommand,
  AdminSetUserPasswordCommand,
  InitiateAuthCommand,
  AuthFlowType
} from "@aws-sdk/client-cognito-identity-provider";
import { CognitoPort } from "../../domain/repositories/cognitoRepositoryPort";
import { LoginResponse } from "../../domain/entities/loginResponse";

export class CognitoService implements CognitoPort {

  private client: CognitoIdentityProviderClient;
  private userPoolId = process.env.COGNITO_USER_POOL_ID!;
  private clientId = process.env.COGNITO_CLIENT_ID!;

  constructor() {
    this.client = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION,
    });
  }

  async create(email: string, password: string) {
    await this.client.send(new AdminCreateUserCommand({
      UserPoolId: this.userPoolId,
      Username: email,
      TemporaryPassword: password,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "email_verified", Value: "true" }
      ],
      MessageAction: "SUPPRESS"
    }));

    await this.client.send(new AdminSetUserPasswordCommand({
      UserPoolId: this.userPoolId,
      Username: email,
      Password: password,
      Permanent: true
    }));

    const user = await this.client.send(new AdminGetUserCommand({
      UserPoolId: this.userPoolId,
      Username: email
    }));

    const sub = user.UserAttributes?.find(a => a.Name === "sub")?.Value;

    if (!sub) throw new Error("No se pudo obtener el cognito_sub");

    return { cognito_sub: sub };
  }


  async doLogin(username: string, password: string): Promise<LoginResponse> {

        try {
          const command = new InitiateAuthCommand({
            AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
            ClientId: this.clientId,
            AuthParameters: {
              USERNAME: username,
              PASSWORD: password
            }
          });

          const result = await this.client.send(command);

          if (!result.AuthenticationResult) {
            throw new Error("InvalidCredentials");
          }

          return {
            message: "Autenticación exitosa",
            idToken: result.AuthenticationResult.IdToken!,
            accessToken: result.AuthenticationResult.AccessToken!,
            refreshToken: result.AuthenticationResult.RefreshToken!,
            expiresIn: result.AuthenticationResult.ExpiresIn!
          };

        } catch (error: any) {
          console.error("Error Cognito:", error);

          if (error.name === "NotAuthorizedException") {
            throw new Error("INVALID_CREDENTIALS");
          }

          if (error.name === "UserNotFoundException") {
            throw new Error("USER_NOT_FOUND");
          }

          throw new Error("AUTH_INTERNAL_ERROR");
        }
      }
}
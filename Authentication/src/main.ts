import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AuthFlowType
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION
});

interface LoginRequest {
  username: string;
  password: string;
  company: string;
}

export const handler = async (event: any) => {
  try {
    if (!event.body) {
      return response(400, { message: "Body requerido" });
    }

    const { username, password, company }: LoginRequest = JSON.parse(event.body);

    if (!username || !password || !company) {
      return response(400, { message: "username, password y empresa son obligatorios" });
    }

    //todo: consultar lambda de informacion de empresa en tabla Master para traer el user pool id
    
    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: process.env.COGNITO_CLIENT_ID!,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      }
    });

    const result = await client.send(command);

    if (!result.AuthenticationResult) {
      return response(401, { message: "Credenciales inválidas" });
    }

    return response(200, {
      message: "Autenticación exitosa",
      idToken: result.AuthenticationResult.IdToken,
      accessToken: result.AuthenticationResult.AccessToken,
      refreshToken: result.AuthenticationResult.RefreshToken,
      expiresIn: result.AuthenticationResult.ExpiresIn
    });

  } catch (error: any) {
    console.error("Error Cognito:", error);

    if (error.name === "NotAuthorizedException") {
      return response(401, { message: "Credenciales incorrectas" });
    }

    if (error.name === "UserNotFoundException") {
      return response(404, { message: "Usuario no encontrado" });
    }

    return response(500, {
      message: "Error interno de autenticación",
      error: error.message
    });
  }
};

function response(statusCode: number, body: any) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(body)
  };
}
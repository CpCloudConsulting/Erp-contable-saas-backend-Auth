import { APIGatewayProxyEventV2 } from "aws-lambda";

export interface AuthorizerContext {
  schema: string;
  tenantId: string;
  userId: string;
}

export interface CustomAPIGatewayEvent
  extends APIGatewayProxyEventV2 {
  requestContext: APIGatewayProxyEventV2["requestContext"] & {
    authorizer: AuthorizerContext;
  };
  httpMethod?: string;
}
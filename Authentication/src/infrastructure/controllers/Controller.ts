import { Container } from "../../container/Container";
import { CustomAPIGatewayEvent } from "../../shared/types";

type RouteHandler = (event: CustomAPIGatewayEvent) => Promise<any>;

export class Controller {

  private routes: Record<string, RouteHandler>;
  private Domain = "/auth";

  constructor() {
    this.routes = {
      "POST /user": this.createUser,
      "POST /login": this.doLogin,
    };
  }


  async handle(event: CustomAPIGatewayEvent) {
    
    if (event.action === "createUser") {
      return await this.createUser(event);
    }

    let routeKey = event.routeKey;
    routeKey = routeKey.replace(this.Domain, "");
    
    const handler = this.routes[routeKey];

    if (!handler) {
      return this.notFound();
    }

    try {
      return await handler.call(this, event);
    } catch (error: any) {
      return this.badRequest(error.message);
    }
  }

  private async createUser(event: CustomAPIGatewayEvent) {
    const body = event.body? JSON.parse(event.body) : event;
    const container = new Container();
    const user = await container.createUser.execute(body);
    return this.ok(user);
  }

  private async doLogin(event: CustomAPIGatewayEvent){
    const body = JSON.parse(event.body || "{}");
    const container = new Container();
    const user = await container.doLogin.execute(body);
    return this.ok(user);
  }

  private ok(data: any) {
    return { statusCode: 200, body: data };
  }

  private badRequest(message: string) {
    return { statusCode: 400, body: { error: message } };
  }

  private notFound() {
    return { statusCode: 404, body: { error: "Ruta no encontrada" } };
  }
}
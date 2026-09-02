import { Request, Response } from "express";
import { Container } from "../../container/Container";

export class AuthController {

  async doLogin(req: Request, res: Response) {
    const body = req.body;
    const services = new Container(req.dbClient!);
    const login = await services.login.execute(body);
    return res.json(login);
  }

  async CreateUser(req: Request, res: Response) {
    const body = req.body;
    const services = new Container(req.dbClient!);
    const user = await services.user.execute(body);
    return res.json(user);
  }

   async CreateClient(req: Request, res: Response) {
    const body = req.body;
    const services = new Container(req.dbClient!);
    const client = await services.client.execute(body);
    return res.json(client);
  }

  async CreateStylist(req: Request, res: Response) {
    const body = req.body;
    const services = new Container(req.dbClient!);
    const stylist = await services.createStylist.execute(body);
    return res.json(stylist);
  }

  async ListStylist(req: Request, res: Response) {
    const services = new Container(req.dbClient!);
    const stylists = await services.listStylist.execute();
    return res.json(stylists);
  }

   async StylistById(req: Request, res: Response) {
    const services = new Container(req.dbClient!);
    const stylist = await services.StylistById.execute();
    return res.json(stylist);
  }
  

}
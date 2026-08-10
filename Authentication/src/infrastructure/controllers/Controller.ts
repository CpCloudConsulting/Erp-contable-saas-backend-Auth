import { Request, Response } from "express";
import { Container } from "../../container/Container";

export class AuthController {

  async doLogin(req: Request, res: Response) {
    const body = req.body;
    const services = new Container(req.dbClient!);
    const login = await services.doLogin.execute(body);
    return res.json(login);
  }


  async doCreate(req: Request, res: Response) {
    console.log("🔥 CREATE USER");
    const body = req.body;
    const services = new Container(req.dbClient!);
    const user = await services.doCreate.execute(body);
    return res.json(user);
  }

}
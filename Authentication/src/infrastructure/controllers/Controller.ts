import { Request, Response } from "express";
import { Container } from "../../container/Container";
import { coreContainer } from "../../container/core-container.instance";

export class AuthController {

  async doLogin(req: Request, res: Response) {
    const body = req.body;
    const services = await Container.create(req.dbClient!);
    const login = await services.login.execute(body, req.tenantSchema!);
    return res.json(login);
  }

  async CreateUser(req: Request, res: Response) {
    const body = req.body;
    const services = await Container.create(req.dbClient!);
    const user = await services.user.execute(body);
    return res.json(user);
  }

  async CreateClient(req: Request, res: Response) {
    const body = req.body;
    const services = await Container.create(req.dbClient!);
    const client = await services.client.execute(body);
    return res.json(client);
  }

  async CreateStylist(req: Request, res: Response) {
    const body = req.body;
    const services = await Container.create(req.dbClient!);
    const stylist = await services.createStylist.execute(body);
    return res.json(stylist);
  }

  async ListStylist(req: Request, res: Response) {
    const services = await Container.create(req.dbClient!);
    const stylists = await services.listStylist.execute();
    return res.json(stylists);
  }

  async StylistById(req: Request, res: Response) {
    const services = await Container.create(req.dbClient!);
    const stylist = await services.StylistById.execute();
    return res.json(stylist);
  }

  async CreateServices(req: Request, res: Response) {
    const body = req.body;
    const services = await Container.create(req.dbClient!);
    const service = await services.createService.execute(body);
    return res.json(service);
  }

  async CreateProducts(req: Request, res: Response) {
    const body = req.body;
    const services = await Container.create(req.dbClient!);
    const product = await services.createProduct.execute(body);
    return res.json(product);
  }

  async ListProducts(req: Request, res: Response) {
    const services = await Container.create(req.dbClient!);
    const products = await services.listProduct.execute();
    return res.json(products);
  }

  async ListServices(req: Request, res: Response) {
    const services = await Container.create(req.dbClient!);
    const service = await services.listService.execute();
    return res.json(service);
  }

  async ListClients(req: Request, res: Response) {
    const services = await Container.create(req.dbClient!);
    const clients = await services.listClients.execute();
    return res.json(clients);
  }

  async CreateSale(req: Request, res: Response) {
    const body = req.body;
    const services = await Container.create(req.dbClient!);
    const product = await services.createSale.execute(body);
    return res.json(product);
  }

  async GetTenant(req: Request, res: Response) {
    const { subdomain } = req.params;
    if (typeof subdomain !== 'string') {
      return res.status(400).json({
        message: 'El subdominio del tenant no es válido',
      });
    }
    const tenant = await coreContainer.findTenant.execute(subdomain);
    return res.json(tenant);
  }

}
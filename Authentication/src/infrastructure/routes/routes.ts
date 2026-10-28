import { Router } from "express";
import { AuthController } from "../controllers/Controller";

const router = Router();
const controller = new AuthController();

router.post("/auth/login", controller.doLogin.bind(controller));
router.post("/user", controller.CreateUser.bind(controller));
router.get("/clients", controller.ListClients.bind(controller));
router.post("/clients", controller.CreateClient.bind(controller));
router.post("/stylist", controller.CreateStylist.bind(controller));
router.get("/stylist", controller.ListStylist.bind(controller));
router.get("/stylist/:id", controller.StylistById.bind(controller));
router.post("/services", controller.CreateServices.bind(controller));
router.get("/services", controller.ListServices.bind(controller));
router.post("/products", controller.CreateProducts.bind(controller));
router.get("/products", controller.ListProducts.bind(controller));
router.post("/sales", controller.CreateSale.bind(controller));
router.get("/locations", controller.ListLocations.bind(controller));

export default router;
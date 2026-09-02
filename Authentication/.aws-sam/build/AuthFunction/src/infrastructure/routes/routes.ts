import { Router } from "express";
import { AuthController } from "../controllers/Controller";

const router = Router();
const controller = new AuthController();

router.post("/auth/login", controller.doLogin.bind(controller));

router.post("/user", controller.CreateUser.bind(controller));

router.post("/clients", controller.CreateClient.bind(controller));

router.post("/stylist", controller.CreateStylist.bind(controller));
router.get("/stylist", controller.ListStylist.bind(controller));
router.get("/stylist/:id", controller.StylistById.bind(controller));

export default router;
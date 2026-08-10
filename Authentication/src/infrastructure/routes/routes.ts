import { Router } from "express";
import { AuthController } from "../controllers/Controller";

const router = Router();
const controller = new AuthController();

router.post("/login", controller.doLogin.bind(controller));
router.post("/user", controller.doCreate.bind(controller));

export default router;
import { Router } from "express";
import { AuthController } from "../controllers/Controller";

const router = Router();

const controller = new AuthController();

router.get(
  "/:subdomain",
  controller.GetTenant.bind(controller),
);

export default router;
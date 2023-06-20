import { Router } from "express";

// Services
import { JWTService } from "@services";

// Routes
import registryRouter from "./registry";
import operatorRouter from "./operator";

const router = Router();

router.use("/registry", JWTService.refreshCookies, registryRouter);
router.use("/operator", operatorRouter);

export default router;

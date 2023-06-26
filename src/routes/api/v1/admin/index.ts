import { Router } from "express";

// Services
import { JWTService } from "@services";

// Routes
import registryRouter from "./registry";

const router = Router();

router.use("/registry", JWTService.refreshCookies, registryRouter);

export default router;

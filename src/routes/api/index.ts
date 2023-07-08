import { Router } from "express";

// Routes
import specsRouter from "./specs";
import v1Router from "./v1";

const router = Router();

router.use("/specs", specsRouter);
router.use("/v1", v1Router);

export default router;

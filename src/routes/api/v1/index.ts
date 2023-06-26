import { Router } from "express";

import adminRouter from "./admin";
import operatorRouter from "./operator";

const router = Router();

router.use("/admin", adminRouter);
router.use("/operator", operatorRouter);

export default router;

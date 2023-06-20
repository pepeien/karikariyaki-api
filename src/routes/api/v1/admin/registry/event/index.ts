import { Router } from "express";

// Routes
import eventRouter from "./event";
import orderRouter from "./order";

const router = Router();

router.use("/", eventRouter);
router.use("/order", orderRouter);

export default router;

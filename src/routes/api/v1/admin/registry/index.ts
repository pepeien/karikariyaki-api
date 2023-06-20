import { Router } from "express";

// Routes
import eventRouter from "./event";
import menuRouter from "./menu";
import operatorRouter from "./operator";
import productRouter from "./product";
import realmRouter from "./realm";

const router = Router();

router.use("/event", eventRouter);
router.use("/menu", menuRouter);
router.use("/operator", operatorRouter);
router.use("/product", productRouter);
router.use("/realm", realmRouter);

export default router;

import { Router } from 'express';

// Routes
import eventRouter from './event';

const router = Router();

router.use('/event', eventRouter);

export default router;

import { Router } from 'express';

// Services
import { JWTService } from '@services';

// Routes
import registryRouter from './registry';
import telemetryRouter from './telemetry';

const router = Router();

router.use('/registry', JWTService.refreshCookies, registryRouter);
router.use('/telemetry', JWTService.refreshCookies, telemetryRouter);

export default router;

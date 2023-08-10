import { Router } from 'express';

// Types
import { default as Endpoints } from './enpoints';

// Services
import { ResponseService } from '@services';

const router = Router();

router.get('/', async (req, res) => {
    try {
        res.status(200).json(ResponseService.generateSucessfulResponse(Endpoints));
    } catch (error) {
        res.status(error.code ?? 500).json(ResponseService.generateFailedResponse(error.message));
    }
});

export default router;

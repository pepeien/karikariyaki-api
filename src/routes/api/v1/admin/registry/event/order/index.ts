import { Router } from 'express';
import QRCode from 'qrcode';
import { Operator, OrderItemParam, QrCodeRseponse } from 'karikarihelper';

// Types
import { OrderErrors } from '@models';
import { InHouseError } from '@types';

// Enums
import { OrderStatus } from '@enums';

// Services
import { OrderService, RequestService, ResponseService } from '@services';

const router = Router();

export enum RedirectorErrors {
    CLIENT_APP_ADDRESS_MISSING = 'ERROR_CLIENT_APP_ADDRESS_MISSING',
}

router.get('/', async (req, res) => {
    try {
        const foundEventOrders = await OrderService.query(res.locals.operator as Operator, {
            id: RequestService.queryParamToString(req.query.id),
            eventId: RequestService.queryParamToString(req.query.eventId),
            status: RequestService.queryParamToString(req.query.status),
            operatorId: RequestService.queryParamToString(req.query.operatorId),
            clientName: RequestService.queryParamToString(req.query.clientName),
        });

        res.status(200).json(ResponseService.generateSucessfulResponse(foundEventOrders));
    } catch (error) {
        res.status(error.code ?? 500).json(ResponseService.generateFailedResponse(error.message));
    }
});

router.get('/status', (req, res) => {
    try {
        res.status(200).json(ResponseService.generateSucessfulResponse(Object.values(OrderStatus)));
    } catch (error) {
        res.status(error.code ?? 500).json(ResponseService.generateFailedResponse(error.message));
    }
});

router.get('/qr/:orderId', async (req, res) => {
    try {
        if (!process.env['CLIENT_APP_ADDRESS']) {
            throw new InHouseError(RedirectorErrors.CLIENT_APP_ADDRESS_MISSING);
        }

        const orderId = req.params.orderId;

        if (!orderId) {
            throw new InHouseError(OrderErrors.INVALID, 400);
        }

        const foundOrder = await OrderService.queryById(orderId);

        if (!foundOrder) {
            throw new InHouseError(OrderErrors.NOT_FOUND, 404);
        }

        const redirectorURI = `${process.env['CLIENT_APP_ADDRESS']}/order/${foundOrder.id}`;

        const result = await QRCode.toDataURL(redirectorURI, {
            color: {
                light: '#0000',
            },
            width: 512,
        });

        res.status(200).json(
            ResponseService.generateSucessfulResponse({
                base64: result,
                redirector: redirectorURI,
            } as QrCodeRseponse),
        );
    } catch (error) {
        res.status(error.code ?? 500).json(ResponseService.generateFailedResponse(error.message));
    }
});

router.post('/', async (req, res) => {
    try {
        const eventId = RequestService.queryParamToString(req.body.eventId);
        const clientName = RequestService.queryParamToString(req.body.clientName);
        const items = req.body.items as OrderItemParam[];

        // Non obligatory params
        const operatorId = RequestService.queryParamToString(req.body.operatorId);
        const status = RequestService.queryParamToString(req.body.status);

        if (!eventId || !clientName || !items || items.length === 0) {
            throw new InHouseError(OrderErrors.INVALID, 400);
        }

        const response = await OrderService.save(res.locals.operator as Operator, {
            eventId: eventId,
            status: status,
            operatorId: operatorId,
            clientName: clientName,
            items: items,
        });

        res.status(200).json(ResponseService.generateSucessfulResponse(response));
    } catch (error) {
        res.status(error.code ?? 500).json(ResponseService.generateFailedResponse(error.message));
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const status = RequestService.queryParamToString(req.body.status);

        if (!id) {
            throw new InHouseError(OrderErrors.INVALID, 400);
        }

        const response = await OrderService.update(res.locals.operator as Operator, id, {
            status: status,
        });

        res.status(200).json(ResponseService.generateSucessfulResponse(response));
    } catch (error) {
        res.status(error.code ?? 500).json(ResponseService.generateFailedResponse(error.message));
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            res.status(400).json(ResponseService.generateFailedResponse(OrderErrors.INVALID));

            return;
        }

        const response = await OrderService.delete(res.locals.operator as Operator, id);

        if (!response) {
            res.status(404).json(ResponseService.generateFailedResponse(OrderErrors.NOT_FOUND));

            return;
        }

        res.status(200).json(ResponseService.generateSucessfulResponse(response));
    } catch (error) {
        res.status(error.code ?? 500).json(ResponseService.generateFailedResponse(error.message));
    }
});

export default router;

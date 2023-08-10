import { Router } from 'express';
import { Operator } from 'karikarihelper';

// Types
import { OperatorErrors } from '@models';
import { InHouseError } from '@types';

// Services
import { JWTService, OperatorService, RequestService, ResponseService } from '@services';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const foundOperators = await OperatorService.query(res.locals.operator as Operator, {
            id: RequestService.queryParamToString(req.query.id),
            realmId: RequestService.queryParamToString(req.query.realmId),
            displayName: RequestService.queryParamToString(req.query.displayName),
        });

        if (!foundOperators) {
            throw new InHouseError(OperatorErrors.NOT_FOUND, 404);
        }

        res.status(200).json(ResponseService.generateSucessfulResponse(foundOperators));
    } catch (error) {
        res.status(error.code ?? 500).json(ResponseService.generateFailedResponse(error.message));
    }
});

router.get('/roles', async (req, res) => {
    try {
        const operator = res.locals.operator as Operator;

        res.status(200).json(
            ResponseService.generateSucessfulResponse(
                OperatorService.getAvailableRolesByRole(operator.role),
            ),
        );
    } catch (error) {
        res.status(error.code ?? 500).json(ResponseService.generateFailedResponse(error.message));
    }
});

router.get('/self', async (req, res) => {
    try {
        const decodedAccessToken = JWTService.decodeAccessToken(
            req.cookies[process.env.COOKIE_NAME],
        );

        const foundOperator = await OperatorService.queryByUserName(decodedAccessToken.userName);

        if (!foundOperator) {
            throw new InHouseError(OperatorErrors.NOT_FOUND, 404);
        }

        res.status(200).json(ResponseService.generateSucessfulResponse(foundOperator));
    } catch (error) {
        res.status(error.code ?? 500).json(ResponseService.generateFailedResponse(error.message));
    }
});

router.post('/', async (req, res) => {
    try {
        const userName = RequestService.queryParamToString(req.body.userName);
        const displayName = RequestService.queryParamToString(req.body.displayName);
        const realmId = RequestService.queryParamToString(req.body.realmId);
        const role = RequestService.queryParamToString(req.body.role);
        const photo = RequestService.queryParamToString(req.body.photo);

        if (!userName || !displayName || !realmId || !role) {
            throw new InHouseError(OperatorErrors.INVALID, 400);
        }

        const response = await OperatorService.save(res.locals.operator as Operator, {
            userName: userName,
            displayName: displayName,
            realmId: realmId,
            role: role,
            photo: photo,
        });

        res.status(200).json(ResponseService.generateSucessfulResponse(response));
    } catch (error) {
        res.status(error.code ?? 500).json(ResponseService.generateFailedResponse(error.message));
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const id = RequestService.queryParamToString(req.params.id);
        const displayName = RequestService.queryParamToString(req.body.displayName);
        const role = RequestService.queryParamToString(req.body.role);
        const photo = RequestService.queryParamToString(req.body.photo);

        if (!id) {
            throw new InHouseError(OperatorErrors.INVALID, 400);
        }

        const response = await OperatorService.update(res.locals.operator as Operator, id, {
            displayName: displayName,
            role: role,
            photo: photo,
        });

        res.status(200).json(ResponseService.generateSucessfulResponse(response));
    } catch (error) {
        res.status(error.code ?? 500).json(ResponseService.generateFailedResponse(error.message));
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = RequestService.queryParamToString(req.params.id);

        if (!id) {
            throw new InHouseError(OperatorErrors.INVALID, 400);
        }

        const response = await OperatorService.delete(res.locals.operator as Operator, id);

        if (!response) {
            throw new InHouseError(OperatorErrors.NOT_FOUND, 404);
        }

        res.status(200).json(ResponseService.generateSucessfulResponse(response));
    } catch (error) {
        res.status(error.code ?? 500).json(ResponseService.generateFailedResponse(error.message));
    }
});

export default router;

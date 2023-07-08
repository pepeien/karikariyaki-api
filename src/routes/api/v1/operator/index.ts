import { Router } from "express";

// Types
import { OperatorErrors } from "@models";
import { InHouseError } from "@types";

// Services
import {
    ResponseService,
    JWTService,
    RequestService,
    OperatorService,
} from "@services";

const router = Router();

router.post("/sign-in", async (req, res) => {
    try {
        const userName = RequestService.queryParamToString(req.body.userName);

        if (!userName) {
            throw new InHouseError(OperatorErrors.INVALID, 400);
        }

        const response = await OperatorService.queryByUserName(userName);

        if (!response) {
            res.status(404).json(
                ResponseService.generateFailedResponse(OperatorErrors.NOT_FOUND)
            );

            return;
        }

        JWTService.saveCookies(res, userName);

        res.status(200).json(
            ResponseService.generateSucessfulResponse(response)
        );
    } catch (error) {
        res.status(error.code ?? 500).json(
            ResponseService.generateFailedResponse(error.message)
        );
    }
});

router.get("/sign-out", (req, res) => {
    try {
        JWTService.clearCookies(req, res);

        res.status(200).json(ResponseService.generateSucessfulResponse());
    } catch (error) {
        res.status(error.code ?? 500).json(
            ResponseService.generateFailedResponse(error.message)
        );
    }
});

export default router;

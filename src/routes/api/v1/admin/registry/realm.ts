import { Router } from "express";
import { Operator } from "karikarihelper";

// Types
import { RealmErrors } from "@models";
import { InHouseError } from "@types";

// Services
import { RequestService, ResponseService, RealmService } from "@services";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const foundRealm = await RealmService.query(
            res.locals.operator as Operator,
            {
                id: RequestService.queryParamToString(req.query.id),
                name: RequestService.queryParamToString(req.query.name),
            }
        );

        res.status(200).json(
            ResponseService.generateSucessfulResponse(foundRealm)
        );
    } catch (error) {
        res.status(error.code ?? 500).json(
            ResponseService.generateFailedResponse(error.message)
        );
    }
});

router.post("/", async (req, res) => {
    try {
        const name = RequestService.queryParamToString(req.body.name);

        if (!name) {
            throw new InHouseError(RealmErrors.INVALID, 400);
        }

        const response = await RealmService.save(
            res.locals.operator as Operator,
            {
                name: name,
            }
        );

        res.status(200).json(
            ResponseService.generateSucessfulResponse(response)
        );
    } catch (error) {
        res.status(error.code ?? 500).json(
            ResponseService.generateFailedResponse(error.message)
        );
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const name = RequestService.queryParamToString(req.body.name);

        if (!id) {
            throw new InHouseError(RealmErrors.INVALID, 400);
        }

        const response = await RealmService.update(
            res.locals.operator as Operator,
            id,
            { name: name }
        );

        res.status(200).json(
            ResponseService.generateSucessfulResponse(response)
        );
    } catch (error) {
        res.status(error.code ?? 500).json(
            ResponseService.generateFailedResponse(error.message)
        );
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            throw new InHouseError(RealmErrors.INVALID, 400);
        }

        const response = await RealmService.delete(
            res.locals.operator as Operator,
            id
        );

        if (!response) {
            throw new InHouseError(RealmErrors.NOT_FOUND, 404);
        }

        res.status(200).json(
            ResponseService.generateSucessfulResponse(response)
        );
    } catch (error) {
        res.status(error.code ?? 500).json(
            ResponseService.generateFailedResponse(error.message)
        );
    }
});

export default router;

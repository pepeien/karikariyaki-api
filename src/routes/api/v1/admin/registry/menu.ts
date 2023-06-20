import { Router } from "express";
import { Operator } from "karikarihelper";

//Types
import { MenuErrors } from "@models";
import { InHouseError } from "@types";

// Services
import { MenuService, RequestService, ResponseService } from "@services";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const id = RequestService.queryParamToString(req.query.id);
        const title = RequestService.queryParamToString(req.query.title);
        const parentId = RequestService.queryParamToString(req.query.parentId);

        const response = await MenuService.query(
            res.locals.operator as Operator,
            {
                id: id,
                title: title,
                parentId: parentId,
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

router.get("/self", async (req, res) => {
    try {
        const response = await MenuService.querySelf(
            res.locals.operator as Operator
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

router.post("/", (req, res) => {
    try {
        const title = RequestService.queryParamToString(req.body.title);
        const icon = RequestService.queryParamToString(req.body.icon);
        const route = RequestService.queryParamToString(req.body.route);
        const parentId = RequestService.queryParamToString(req.body.parentId);

        if (!title) {
            throw new InHouseError(MenuErrors.INVALID, 400);
        }

        const response = MenuService.save(res.locals.operator as Operator, {
            title: title,
            icon: icon,
            route: route,
            parentId: parentId,
        });

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
        const icon = RequestService.queryParamToString(req.body.icon);
        const title = RequestService.queryParamToString(req.body.title);
        const route = RequestService.queryParamToString(req.body.route);

        if (!id) {
            throw new InHouseError(MenuErrors.INVALID, 400);
        }

        const response = await MenuService.update(
            res.locals.operator as Operator,
            id,
            {
                icon: icon,
                title: title,
                route: route,
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

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            throw new InHouseError(MenuErrors.INVALID, 400);
        }

        const response = await MenuService.delete(
            res.locals.operator as Operator,
            id
        );

        if (!response) {
            res.status(404).json(
                ResponseService.generateFailedResponse(MenuErrors.NOT_FOUND)
            );

            return;
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

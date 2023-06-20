import { Router } from "express";
import { Ingredient, Operator } from "karikarihelper";

// Types
import { ProductErrors } from "@models";
import { InHouseError } from "@types";

// Services
import { RequestService, ResponseService, ProductService } from "@services";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const foundProducts = await ProductService.query(
            res.locals.operator as Operator,
            {
                id: RequestService.queryParamToString(req.query.id),
                name: RequestService.queryParamToString(req.query.name),
                realmId: RequestService.queryParamToString(req.query.realmId),
            }
        );

        res.status(200).json(
            ResponseService.generateSucessfulResponse(foundProducts)
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
        const realmId = RequestService.queryParamToString(req.body.realmId);
        const ingredients = req.body.ingredients as Ingredient[];

        if (!name) {
            throw new InHouseError(ProductErrors.INVALID, 400);
        }

        const response = await ProductService.save(
            res.locals.operator as Operator,
            {
                name: name,
                realmId: realmId,
                ingredients: ingredients,
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
        const ingredients = req.body.ingredients as Ingredient[];

        if (!id) {
            throw new InHouseError(ProductErrors.INVALID, 400);
        }

        const response = await ProductService.update(
            res.locals.operator as Operator,
            id,
            { name: name, ingredients: ingredients }
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
            throw new InHouseError(ProductErrors.INVALID, 400);
        }

        const response = await ProductService.delete(
            res.locals.operator as Operator,
            id
        );

        if (!response) {
            throw new InHouseError(ProductErrors.NOT_FOUND, 404);
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

import { PopulateOptions } from "mongoose";
import {
    Operator,
    OperatorRole,
    ProductCreatableParams,
    ProductEditableParams,
    ProductQueryableParams,
} from "karikarihelper";

// Types
import { OperatorErrors, ProductModel } from "@models";
import { InHouseError } from "@types";

// Services
import { DatabaseService, StringService } from "@services";

export class ProductService {
    public static visibleParameters = ["name", "realm", "ingredients"];

    private static _populateOptions = [
        {
            path: "realm",
            select: "name",
        },
    ] as PopulateOptions[];

    public static async query(
        operator: Operator,
        values: ProductQueryableParams
    ) {
        await DatabaseService.getConnection();

        const query = [];

        if (values.id) {
            query.push({
                _id: StringService.toObjectId(values.id),
            });
        }

        if (values.name) {
            query.push({
                name: DatabaseService.generateBroadQuery(values.name),
            });
        }

        let realmQuery = {
            realm: StringService.toObjectId(operator.realm._id),
        };

        if (operator.role === OperatorRole.ADMIN) {
            realmQuery = null;

            if (values.realmId) {
                realmQuery = {
                    realm: StringService.toObjectId(values.realmId),
                };
            }
        }

        if (realmQuery) {
            query.push(realmQuery);
        }

        return ProductModel.find(query.length === 0 ? null : { $and: query })
            .select(ProductService.visibleParameters)
            .populate(ProductService._populateOptions);
    }

    public static async queryById(id: string) {
        await DatabaseService.getConnection();

        return ProductModel.findById(StringService.toObjectId(id))
            .select(ProductService.visibleParameters)
            .populate(ProductService._populateOptions);
    }

    public static async save(
        operator: Operator,
        values: ProductCreatableParams
    ) {
        await DatabaseService.getConnection();

        const newEntry = new ProductModel();

        newEntry.name = values.name.trim();
        newEntry.realm = StringService.toObjectId(
            operator.role === OperatorRole.ADMIN
                ? values.realmId
                : operator.realm._id
        );
        newEntry.ingredients = values.ingredients ?? [];

        await newEntry.save();

        return ProductModel.findById(newEntry._id)
            .select(ProductService.visibleParameters)
            .populate(ProductService._populateOptions);
    }

    public static async update(
        operator: Operator,
        id: string,
        values: ProductEditableParams
    ) {
        await DatabaseService.getConnection();

        if (operator.role !== OperatorRole.ADMIN) {
            const foundOperator = await ProductModel.findById(id);

            if (
                operator.realm._id.toString() !==
                foundOperator.realm._id.toString()
            ) {
                throw new InHouseError(OperatorErrors.FORBIDDEN, 403);
            }
        }

        values.name = values.name?.trim();

        return ProductModel.findByIdAndUpdate(
            StringService.toObjectId(id),
            {
                $set: {
                    name: values.name ?? undefined,
                    ingredients: values.ingredients ?? undefined,
                },
            },
            { runValidators: true }
        )
            .select(ProductService.visibleParameters)
            .populate(ProductService._populateOptions);
    }

    public static async delete(operator: Operator, id: string) {
        await DatabaseService.getConnection();

        if (operator.role !== OperatorRole.ADMIN) {
            const foundProduct = await ProductService.queryById(id);

            if (
                operator.realm._id.toString() !==
                foundProduct.realm._id.toString()
            ) {
                throw new InHouseError(OperatorErrors.FORBIDDEN, 403);
            }
        }

        const productId = StringService.toObjectId(id);

        return ProductModel.findByIdAndDelete(productId)
            .select(ProductService.visibleParameters)
            .populate(ProductService._populateOptions);
    }
}

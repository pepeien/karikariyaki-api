import { PopulateOptions } from "mongoose";
import {
    EventOrderCreatableParams,
    EventOrderEditableParams,
    EventOrderQueryableParams,
    IngredientType,
    Operator,
    OperatorRole,
} from "karikarihelper";

// Types
import { InHouseError } from "@types";
import { EventModel, OperatorErrors, OrderErrors, OrderModel } from "@models";

// Services
import {
    DatabaseService,
    OperatorService,
    ProductService,
    StringService,
} from "@services";

export class OrderService {
    public static visibleParameters = ["realm", "status", "client"];

    private static _populateOptions = [
        {
            path: "event",
            select: ["name", "date"],
        },
        {
            path: "operator",
            select: "displayName",
        },
        {
            path: "realm",
            select: "name",
        },
        {
            path: "items",
            select: ["product", "modifications"],
            populate: {
                path: "product",
                select: "name",
            },
        },
    ] as PopulateOptions[];

    public static async query(
        operator: Operator,
        values: EventOrderQueryableParams
    ) {
        await DatabaseService.getConnection();

        const query = [];

        if (values.id) {
            query.push({
                _id: values.id,
            });
        }

        if (values.eventId) {
            query.push({ event: values.eventId });
        }

        if (values.status) {
            query.push({ status: values.status });
        }

        if (values.operatorId) {
            query.push({ operator: values.operatorId });
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

        if (values.clientName) {
            query.push({ client: values.clientName });
        }

        return OrderModel.find(query.length === 0 ? null : { $and: query })
            .select(OrderService.visibleParameters)
            .populate(OrderService._populateOptions);
    }

    public static async queryById(id: string) {
        await DatabaseService.getConnection();

        return OrderModel.findById(id)
            .select(OrderService.visibleParameters)
            .populate(OrderService._populateOptions);
    }

    public static async save(
        operator: Operator,
        values: EventOrderCreatableParams
    ) {
        await DatabaseService.getConnection();

        const newEntry = new OrderModel();

        newEntry.event = StringService.toObjectId(values.eventId);
        newEntry.status = newEntry.status;

        const foundOperator = await OperatorService.queryById(operator._id);

        if (!foundOperator) {
            throw new InHouseError(OperatorErrors.NOT_FOUND, 404);
        }

        if (operator.role === OperatorRole.ADMIN && values.operatorId) {
            newEntry.operator = foundOperator._id;
            newEntry.realm = foundOperator.realm._id;
        } else {
            newEntry.operator = StringService.toObjectId(operator._id);
            newEntry.realm = StringService.toObjectId(operator.realm._id);
        }

        newEntry.client = values.clientName?.trim();

        for (const item of values.items) {
            const isModificationValid =
                item.modifications.filter(
                    (entry) => entry.type === IngredientType.BASE
                ).length === 0;

            if (isModificationValid === false) {
                throw new InHouseError(OrderErrors.REALM_INVALID, 400);
            }

            const foundItem = await ProductService.queryById(item.productId);

            if (
                foundItem.realm._id.toString() !==
                foundOperator.realm._id.toString()
            ) {
                throw new InHouseError(OrderErrors.REALM_INVALID, 400);
            }

            newEntry.items.push({
                product: StringService.toObjectId(item.productId),
                modifications: item.modifications ?? [],
            });
        }

        await EventModel.findByIdAndUpdate(
            newEntry.event,
            {
                $push: {
                    orders: newEntry._id,
                },
            },
            { runValidators: true }
        );

        await newEntry.save();

        return OrderModel.findById(newEntry._id)
            .select(OrderService.visibleParameters)
            .populate(OrderService._populateOptions);
    }

    public static async update(
        operator: Operator,
        id: string,
        values: EventOrderEditableParams
    ) {
        await DatabaseService.getConnection();

        if (operator.role !== OperatorRole.ADMIN) {
            const foundOperator = await OrderService.queryById(id);

            if (
                operator.realm._id.toString() !==
                foundOperator.realm._id.toString()
            ) {
                throw new InHouseError(OperatorErrors.FORBIDDEN, 403);
            }
        }

        return OrderModel.findByIdAndUpdate(
            StringService.toObjectId(id),
            {
                $set: {
                    status: values.status,
                },
            },
            { runValidators: true }
        )
            .select(OrderService.visibleParameters)
            .populate(OrderService._populateOptions);
    }

    public static async delete(operator: Operator, id: string) {
        await DatabaseService.getConnection();

        if (operator.role !== OperatorRole.ADMIN) {
            const foundOperator = await OrderService.queryById(id);

            if (
                operator.realm._id.toString() !==
                foundOperator.realm._id.toString()
            ) {
                throw new InHouseError(OperatorErrors.FORBIDDEN, 403);
            }
        }

        const orderId = StringService.toObjectId(id);

        await EventModel.findOneAndUpdate(
            {
                orders: orderId,
            },
            {
                $pull: {
                    orders: orderId,
                },
            }
        );

        return OrderModel.findByIdAndDelete(orderId)
            .select(OrderService.visibleParameters)
            .populate(OrderService._populateOptions);
    }
}

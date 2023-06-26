import { Schema, Types, model } from "mongoose";
import { Ingredient } from "karikarihelper";

// Types
import { InHouseError, Statics } from "@types";

// Enums
import { OrderStatus } from "@enums";

// Models
import { EventModel, OperatorModel, RealmModel } from "@models";

// Services
import { StringService } from "@services";

export enum OrderErrors {
    CLIENT_NAME_GREATER_THAN_MAX_LENGTH = "ERROR_ORDER_CLIENT_NAME_GREATER_THAN_MAX_LENGTH",
    CLIENT_NAME_LESS_THAN_MIN_LENGTH = "ERROR_ORDER_CLIENT_NAME_LESS_THAN_MIN_LENGTH",
    CLIENT_NAME_REQUIRED = "ERROR_ORDER_CLIENT_NAME_REQUIRED",
    EVENT_INVALID = "ERROR_ORDER_EVENT_INVALID",
    EVENT_REQUIRED = "ERROR_ORDER_EVENT_REQUIRED",
    INVALID = "ERROR_ORDER_INVALID",
    ITEMS_INVALID = "ERROR_ORDER_ITEMS_INVALID",
    ITEMS_REQUIRED = "ERROR_ORDER_ITEMS_REQUIRED",
    NOT_FOUND = "ERROR_ORDER_NOT_FOUND",
    OPERATOR_INVALID = "ERROR_ORDER_OPERATOR_INVALID",
    OPERATOR_REQUIRED = "ERROR_ORDER_OPERATOR_REQUIRED",
    PICKED_UP = "ERROR_ORDER_PICKED_UP",
    REALM_INVALID = "ERROR_OPERATOR_REALM_INVALID",
    REALM_REQUIRED = "ERROR_OPERATOR_REALM_REQUIRED",
}

const validateOrderEvent = async (eventId: Types.ObjectId) => {
    const foundEvent = await EventModel.findById(eventId);

    if (!foundEvent) {
        throw new InHouseError(OrderErrors.EVENT_INVALID);
    }
};

const validateOrderOperator = async (operatorId: Types.ObjectId) => {
    const foundOperator = await OperatorModel.findById(operatorId);

    if (!foundOperator) {
        throw new InHouseError(OrderErrors.OPERATOR_INVALID);
    }
};

const validateOperatorRealm = async (realmId: Types.ObjectId) => {
    const foundRealm = await RealmModel.findById(realmId);

    if (!foundRealm) {
        throw new InHouseError(OrderErrors.REALM_INVALID);
    }
};

const validateOrderClient = async (client: string) => {
    if (
        StringService.isStringInsideBoundaries(
            client,
            Statics.ORDER_CLIENT_NAME_MIN_LENGTH,
            Statics.ORDER_CLIENT_NAME_MAX_LENGTH
        ) === false
    ) {
        if (client.trim().length < Statics.ORDER_CLIENT_NAME_MIN_LENGTH) {
            throw new InHouseError(
                OrderErrors.CLIENT_NAME_LESS_THAN_MIN_LENGTH
            );
        }

        throw new InHouseError(OrderErrors.CLIENT_NAME_GREATER_THAN_MAX_LENGTH);
    }
};

const OrderSchema = new Schema(
    {
        event: {
            type: Schema.Types.ObjectId,
            ref: Statics.EVENT_COLLECTION_NAME,
            required: [true, OrderErrors.EVENT_REQUIRED],
            validate: validateOrderEvent,
        },
        status: {
            type: String,
            enum: OrderStatus,
            default: OrderStatus.COOKING,
        },
        operator: {
            type: Schema.Types.ObjectId,
            ref: Statics.OPERATOR_COLLECTION_NAME,
            required: [true, OrderErrors.OPERATOR_REQUIRED],
            validate: validateOrderOperator,
        },
        realm: {
            type: Schema.Types.ObjectId,
            ref: Statics.REALM_COLLECTION_NAME,
            required: [true, OrderErrors.REALM_REQUIRED],
            validate: validateOperatorRealm,
        },
        client: {
            type: String,
            required: [true, OrderErrors.CLIENT_NAME_REQUIRED],
            validate: validateOrderClient,
        },
        items: {
            type: [
                {
                    product: {
                        type: Schema.Types.ObjectId,
                        ref: Statics.PRODUCT_COLLECTION_NAME,
                    },
                    modifications: Array<Ingredient>,
                },
            ],
            default: [],
        },
    },
    { timestamps: true }
);

const OrderModel = model(Statics.ORDER_COLLECTION_NAME, OrderSchema);

export default OrderModel;

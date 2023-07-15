import { Schema, model } from "mongoose";
import { Ingredient } from "karikarihelper";

// Types
import { Statics } from "@types";

// Enums
import { OrderStatus } from "@enums";

// Validators
import {
    validateOperatorRealm,
    validateOrderClient,
    validateOrderEvent,
    validateOrderOperator,
} from "./validators";

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

import { Schema, Types, model } from "mongoose";

// Types
import { InHouseError, Statics } from "@types";

// Models
import { OrderModel } from "@models";

// Services
import { StringService } from "@services";

export enum EventErrors {
    DATE_REQUIRED = "ERROR_EVENT_DATE_REQUIRED",
    INVALID = "ERROR_EVENT_INVALID",
    NOT_ACTIVE = "ERROR_EVENT_NOT_ACTIVE",
    NOT_FOUND = "ERROR_EVENT_NOT_FOUND",
    NAME_REQUIRED = "ERROR_EVENT_NAME_REQUIRED",
    ORDER_INVALID = "ERROR_EVENT_ORDER_INVALID",
    ORDER_DUPLICATED = "ERROR_EVENT_ORDER_DUPLICATED",
}

const validateEventOrders = async (orderIds: Types.ObjectId[]) => {
    for (const orderId of orderIds) {
        const foundOrder = await OrderModel.findById(
            StringService.toString(orderId)
        );

        if (!foundOrder) {
            throw new InHouseError(EventErrors.ORDER_INVALID);
        }

        if (orderIds.filter((_) => _ !== orderId).length >= 1) {
            throw new InHouseError(EventErrors.ORDER_DUPLICATED);
        }
    }
};

const EventSchema = new Schema({
    name: {
        type: String,
        required: [true, EventErrors.NAME_REQUIRED],
    },
    date: {
        type: Date,
        required: [true, EventErrors.DATE_REQUIRED],
    },
    orders: {
        type: [
            { type: Schema.Types.ObjectId, ref: Statics.ORDER_COLLECTION_NAME },
        ],
        default: [],
        validate: validateEventOrders,
    },
    isOpen: {
        type: Boolean,
        default: false,
    },
});

const EventModel = model(Statics.EVENT_COLLECTION_NAME, EventSchema);

export default EventModel;

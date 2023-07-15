import { Types } from "mongoose";
import { StringService } from "karikarihelper";

// Types
import { InHouseError, Statics } from "@types";
import { OrderErrors } from ".";

// Models
import { EventModel, OperatorModel, RealmModel } from "../..";

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

export {
    validateOperatorRealm,
    validateOrderClient,
    validateOrderEvent,
    validateOrderOperator,
};

import { Schema, model } from "mongoose";
import { OperatorRole } from "karikarihelper";

// Types
import { Statics } from "@types";

// Validator
import {
    validateOperatorDisplayName,
    validateOperatorPhoto,
    validateOperatorRealm,
    validateOperatorUserName,
} from "./validators";

export enum OperatorErrors {
    DISPLAY_NAME_GREATER_THAN_MAX_LENGTH = "ERROR_OPERATOR_DISPLAY_NAME_GREATER_THAN_MAX_LENGTH",
    DISPLAY_NAME_LESS_THAN_MIN_LENGTH = "ERROR_OPERATOR_DISPLAY_NAME_GREATER_THAN_MIN_LENGTH",
    DISPLAY_NAME_REQUIRED = "ERROR_OPERATOR_DISPLAY_NAME_REQUIRED",
    FORBIDDEN = "ERROR_OPERATOR_FORBIDDEN",
    INVALID = "ERROR_OPERATOR_INVALID",
    NOT_FOUND = "ERROR_OPERATOR_NOT_FOUND",
    USER_NAME_DUPLICATED = "ERROR_OPERATOR_USER_NAME_DUPLICATED",
    USER_NAME_GREATER_THAN_MAX_LENGTH = "ERROR_OPERATOR_USER_NAME_GREATER_THAN_MAX_LENGTH",
    USER_NAME_LESS_THAN_MIN_LENGTH = "ERROR_OPERATOR_USER_NAME_LESS_THAN_MIN_LENGTH",
    USER_NAME_REQUIRED = "ERROR_OPERATOR_USER_NAME_REQUIRED",
    REALM_INVALID = "ERROR_OPERATOR_REALM_INVALID",
    REALM_REQUIRED = "ERROR_OPERATOR_REALM_REQUIRED",
    PHOTO_INVALID = "ERROR_OPERATOR_PHOTO_INVALID",
}

const OperatorSchema = new Schema(
    {
        userName: {
            type: String,
            required: [true, OperatorErrors.USER_NAME_REQUIRED],
            validate: validateOperatorUserName,
        },
        displayName: {
            type: String,
            required: [true, OperatorErrors.DISPLAY_NAME_REQUIRED],
            validate: validateOperatorDisplayName,
        },
        role: {
            type: String,
            enum: OperatorRole,
            default: OperatorRole.WORKER,
        },
        realm: {
            type: Schema.Types.ObjectId,
            ref: Statics.REALM_COLLECTION_NAME,
            required: [true, OperatorErrors.REALM_REQUIRED],
            validate: validateOperatorRealm,
        },
        photo: {
            type: String,
            validate: validateOperatorPhoto,
        },
    },
    {
        timestamps: true,
    }
);

const OperatorModel = model(Statics.OPERATOR_COLLECTION_NAME, OperatorSchema);

export default OperatorModel;

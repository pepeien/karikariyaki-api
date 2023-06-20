import { Schema, Types, model } from "mongoose";
import isBase64 from "is-base64";
import { OperatorRole } from "karikarihelper";

// Types
import { InHouseError, Statics } from "@types";

// Model
import RealmModel from "./realm";

// Services
import { DatabaseService, StringService } from "@services";

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

const validateOperatorUserName = async (name: string) => {
    if (
        StringService.isStringInsideBoundaries(
            name,
            Statics.USER_NAME_MIN_LENGTH,
            Statics.USER_NAME_MAX_LENGTH
        ) === false
    ) {
        if (name.trim().length < Statics.USER_NAME_MIN_LENGTH) {
            throw new InHouseError(
                OperatorErrors.USER_NAME_GREATER_THAN_MAX_LENGTH
            );
        }

        throw new InHouseError(OperatorErrors.USER_NAME_LESS_THAN_MIN_LENGTH);
    }

    const entry = await OperatorModel.findOne({
        userName: DatabaseService.generateBroadQuery(name),
    });

    if (entry) {
        throw new InHouseError(OperatorErrors.USER_NAME_DUPLICATED);
    }
};

const validateOperatorDisplayName = async (displayName: string) => {
    if (
        StringService.isStringInsideBoundaries(
            displayName,
            Statics.DISPLAY_NAME_MIN_LENGTH,
            Statics.DISPLAY_NAME_MAX_LENGTH
        ) === false
    ) {
        if (displayName.trim().length < Statics.DISPLAY_NAME_MIN_LENGTH) {
            throw new InHouseError(
                OperatorErrors.DISPLAY_NAME_LESS_THAN_MIN_LENGTH
            );
        }

        throw new InHouseError(
            OperatorErrors.DISPLAY_NAME_GREATER_THAN_MAX_LENGTH
        );
    }
};

const validateOperatorRealm = async (realmId: Types.ObjectId) => {
    const foundRealm = await RealmModel.findById(realmId);

    if (!foundRealm) {
        throw new InHouseError(OperatorErrors.REALM_INVALID);
    }
};

const validateOperatorPhoto = async (photoInBase64: string) => {
    if (!photoInBase64 || photoInBase64.trim().length === 0) {
        return;
    }

    if (
        isBase64(photoInBase64, {
            allowEmpty: false,
            allowMime: true,
            mimeRequired: true,
        }) === false
    ) {
        throw new InHouseError(OperatorErrors.PHOTO_INVALID);
    }
};

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

import { Types } from "mongoose";
import { StringService } from "karikarihelper";
import isBase64 from "is-base64";

// Types
import { Statics, InHouseError } from "@types";
import OperatorModel, { OperatorErrors } from ".";

// Models
import RealmModel from "../realm";

// Services
import { DatabaseService } from "@services";

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

export {
    validateOperatorDisplayName,
    validateOperatorPhoto,
    validateOperatorRealm,
    validateOperatorUserName,
};

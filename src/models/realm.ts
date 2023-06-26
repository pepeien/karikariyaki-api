import { Schema, model } from "mongoose";

// Types
import { InHouseError, Statics } from "@types";

// Services
import { DatabaseService, StringService } from "@services";

export enum RealmErrors {
    INVALID = "ERROR_REALM_INVALID",
    NAME_DUPLICATED = "ERROR_REALM_NAME_DUPLICATED",
    NAME_GREATER_THAN_MAX_LENGTH = "ERROR_REALM_NAME_GREATER_THAN_MAX_LENGTH",
    NAME_LESS_THAN_MIN_LENGTH = "ERROR_REALM_NAME_LESS_THAN_MIN_LENGTH",
    NAME_REQUIRED = "ERROR_REALM_NAME_REQUIRED",
    NOT_FOUND = "ERROR_REALM_NOT_FOUND",
}

const validateRealmName = async (name: string) => {
    if (
        StringService.isStringInsideBoundaries(
            name,
            Statics.REALM_CLIENT_NAME_MIN_LENGTH,
            Statics.REALM_CLIENT_NAME_MAX_LENGTH
        ) === false
    ) {
        if (name.trim().length < Statics.REALM_CLIENT_NAME_MIN_LENGTH) {
            throw new InHouseError(RealmErrors.NAME_LESS_THAN_MIN_LENGTH);
        }

        throw new InHouseError(RealmErrors.NAME_GREATER_THAN_MAX_LENGTH);
    }

    const entry = await RealmModel.findOne({
        name: DatabaseService.generateExactInsensitiveQuery(name),
    });

    if (entry) {
        throw new InHouseError(RealmErrors.NAME_DUPLICATED);
    }
};

const RealmSchema = new Schema({
    name: {
        type: String,
        required: [true, RealmErrors.NAME_REQUIRED],
        validate: validateRealmName,
    },
});

const RealmModel = model(Statics.REALM_COLLECTION_NAME, RealmSchema);

RealmModel.findOne({
    name: Statics.REALM_ADMIN_NAME,
}).then((foundRealm) => {
    if (foundRealm) {
        return;
    }

    const adminRealm = new RealmModel();

    adminRealm.name = Statics.REALM_ADMIN_NAME;

    adminRealm.save();
});

export default RealmModel;

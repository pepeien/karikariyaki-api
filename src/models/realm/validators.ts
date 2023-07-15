import { StringService } from "karikarihelper";

// Types
import { Statics, InHouseError } from "@types";
import RealmModel, { RealmErrors } from ".";

// Services
import { DatabaseService } from "@services";

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

export { validateRealmName };

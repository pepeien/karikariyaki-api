import { Types } from "mongoose";
import { StringService } from "karikarihelper";

// Types
import { Statics, InHouseError } from "@types";
import { ProductErrors } from ".";

// Models
import RealmModel from "../realm";

const validateProductName = async (name: string) => {
    if (
        StringService.isStringInsideBoundaries(
            name,
            Statics.PRODUCT_NAME_MIN_LENGTH,
            Statics.PRODUCT_NAME_MAX_LENGTH
        ) === false
    ) {
        if (name.trim().length < Statics.PRODUCT_NAME_MIN_LENGTH) {
            throw new InHouseError(ProductErrors.NAME_LESS_THAN_MIN_LENGTH);
        }

        throw new InHouseError(ProductErrors.NAME_GREATER_THAN_MAX_LENGTH);
    }
};

const validateProductRealm = async (realmId: Types.ObjectId) => {
    const foundRealm = await RealmModel.findById(realmId);

    if (!foundRealm) {
        throw new InHouseError(ProductErrors.REALM_INVALID);
    }
};

export { validateProductName, validateProductRealm };

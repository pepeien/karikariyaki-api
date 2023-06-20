import { Schema, Types, model } from "mongoose";
import { Ingredient } from "karikarihelper";

// Types
import { InHouseError, Statics } from "@types";

// Models
import { RealmModel } from "@models";

// Services
import { DatabaseService, StringService } from "@services";

export enum ProductErrors {
    INVALID = "ERROR_PRODUCT_INVALID",
    NAME_DUPLICATED = "ERROR_PRODUCT_NAME_DUPLICATED",
    NAME_GREATER_THAN_MAX_LENGTH = "ERROR_PRODUCT_NAME_GREATER_THAN_MAX_LENGTH",
    NAME_LESS_THAN_MIN_LENGTH = "ERROR_PRODUCT_NAME_LESS_THAN_MIN_LENGTH",
    NAME_REQUIRED = "ERROR_PRODUCT_NAME_REQUIRED",
    NOT_FOUND = "ERROR_PRODUCT_NOT_FOUND",
    REALM_INVALID = "ERROR_PRODUCT_REALM_INVALID",
    REALM_REQUIRED = "ERROR_PRODUCT_REALM_REQUIRED",
    PARENT_INVALID = "ERROR_PRODUCT_PARENT_INVALID",
}

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

const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, ProductErrors.NAME_REQUIRED],
        validate: validateProductName,
    },
    realm: {
        type: Schema.Types.ObjectId,
        ref: Statics.REALM_COLLECTION_NAME,
        required: [true, ProductErrors.REALM_REQUIRED],
        validate: validateProductRealm,
    },
    ingredients: {
        type: Array<Ingredient>,
        default: [],
    },
});

const ProductModel = model(Statics.PRODUCT_COLLECTION_NAME, ProductSchema);

export default ProductModel;

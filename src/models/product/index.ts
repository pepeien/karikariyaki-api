import { Schema, model } from 'mongoose';
import { Ingredient } from 'karikarihelper';

// Types
import { Statics } from '@types';

// Validators
import { validateProductName, validateProductRealm } from './validators';

export enum ProductErrors {
    INVALID = 'ERROR_PRODUCT_INVALID',
    NAME_DUPLICATED = 'ERROR_PRODUCT_NAME_DUPLICATED',
    NAME_GREATER_THAN_MAX_LENGTH = 'ERROR_PRODUCT_NAME_GREATER_THAN_MAX_LENGTH',
    NAME_LESS_THAN_MIN_LENGTH = 'ERROR_PRODUCT_NAME_LESS_THAN_MIN_LENGTH',
    NAME_REQUIRED = 'ERROR_PRODUCT_NAME_REQUIRED',
    NOT_FOUND = 'ERROR_PRODUCT_NOT_FOUND',
    REALM_INVALID = 'ERROR_PRODUCT_REALM_INVALID',
    REALM_REQUIRED = 'ERROR_PRODUCT_REALM_REQUIRED',
    PARENT_INVALID = 'ERROR_PRODUCT_PARENT_INVALID',
}

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

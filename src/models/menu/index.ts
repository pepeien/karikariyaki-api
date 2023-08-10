import { Schema, model } from 'mongoose';

// Types
import { Statics } from '@types';

// Validators
import { validateMenuIcon, validateMenuRoute, validateMenuTitle } from './validators';

export enum MenuErrors {
    INVALID = 'ERROR_MENU_INVALID',
    ICON_INVALID = 'ERROR_MENU_ICON_INVALID',
    NOT_FOUND = 'ERROR_MENU_NOT_FOUND',
    ROUTE_DUPLICATED = 'ERROR_MENU_ROUTE_DUPLICATED',
    TITLE_DUPLICATED = 'ERROR_MENU_TITLE_DUPLICATED',
    TITLE_REQUIRED = 'ERROR_MENU_TITLE_REQUIRED',
}

const MenuSchema = new Schema({
    title: {
        type: String,
        required: [true, MenuErrors.TITLE_REQUIRED],
        validate: validateMenuTitle,
    },
    icon: {
        type: String,
        validate: validateMenuIcon,
    },
    roles: {
        type: Array<string>,
        default: [''],
    },
    route: {
        type: String,
        validate: validateMenuRoute,
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: Statics.MENU_COLLECTION_NAME,
    },
    children: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: Statics.MENU_COLLECTION_NAME,
            },
        ],
        default: [],
    },
});

const MenuModel = model(Statics.MENU_COLLECTION_NAME, MenuSchema);

export default MenuModel;

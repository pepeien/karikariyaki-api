import { Schema, model } from "mongoose";
import isBase64 from "is-base64";

// Types
import { InHouseError, Statics } from "@types";

// Service
import { DatabaseService, StringService } from "@services";

export enum MenuErrors {
    INVALID = "ERROR_MENU_INVALID",
    ICON_INVALID = "ERROR_MENU_ICON_INVALID",
    NOT_FOUND = "ERROR_MENU_NOT_FOUND",
    ROUTE_DUPLICATED = "ERROR_MENU_ROUTE_DUPLICATED",
    TITLE_DUPLICATED = "ERROR_MENU_TITLE_DUPLICATED",
    TITLE_REQUIRED = "ERROR_MENU_TITLE_REQUIRED",
}

const validateMenuTitle = async (title: string) => {
    const foundMenu = await MenuModel.findOne({
        title: DatabaseService.generateExactInsensitiveQuery(title),
    });

    if (foundMenu) {
        throw new InHouseError(MenuErrors.TITLE_DUPLICATED);
    }
};

const validateMenuIcon = async (iconInBase64: string) => {
    if (!iconInBase64 || iconInBase64.trim().length === 0) {
        return;
    }

    if (
        isBase64(iconInBase64, {
            allowEmpty: false,
            allowMime: true,
            mimeRequired: true,
        }) === false
    ) {
        throw new InHouseError(MenuErrors.ICON_INVALID);
    }
};

const validateMenuRoute = async (route: string) => {
    if (!route) {
        return;
    }

    const foundMenu = await MenuModel.findOne({
        route: DatabaseService.generateExactInsensitiveQuery(
            StringService.removeLeadingAndTrailingSlashes(route)
        ),
    });

    if (foundMenu) {
        throw new InHouseError(MenuErrors.ROUTE_DUPLICATED);
    }
};

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
        default: [""],
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

import { StringService } from 'karikarihelper';
import isBase64 from 'is-base64';

// Types
import { InHouseError } from '@types';
import MenuModel, { MenuErrors } from '.';

// Services
import { DatabaseService } from '@services';

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
            StringService.removeLeadingAndTrailingSlashes(route),
        ),
    });

    if (foundMenu) {
        throw new InHouseError(MenuErrors.ROUTE_DUPLICATED);
    }
};

export { validateMenuIcon, validateMenuRoute, validateMenuTitle };

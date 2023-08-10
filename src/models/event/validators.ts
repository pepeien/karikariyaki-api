import { Types } from 'mongoose';

// Types
import { InHouseError } from '@types';
import { EventErrors } from '.';

// Models
import { OrderModel } from '..';

// Services
import { StringService } from '@services';

const validateEventOrders = async (orderIds: Types.ObjectId[]) => {
    for (const orderId of orderIds) {
        const foundOrder = await OrderModel.findById(StringService.toString(orderId));

        if (!foundOrder) {
            throw new InHouseError(EventErrors.ORDER_INVALID);
        }

        if (orderIds.filter((_) => _ === orderId).length > 1) {
            throw new InHouseError(EventErrors.ORDER_DUPLICATED);
        }
    }
};

export { validateEventOrders };

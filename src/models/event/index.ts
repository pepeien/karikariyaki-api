import { Schema, model } from 'mongoose';

// Types
import { Statics } from '@types';

// Validators
import { validateEventOrders } from './validators';

export enum EventErrors {
    DATE_REQUIRED = 'ERROR_EVENT_DATE_REQUIRED',
    INVALID = 'ERROR_EVENT_INVALID',
    NOT_ACTIVE = 'ERROR_EVENT_NOT_ACTIVE',
    NOT_FOUND = 'ERROR_EVENT_NOT_FOUND',
    NAME_REQUIRED = 'ERROR_EVENT_NAME_REQUIRED',
    ORDER_INVALID = 'ERROR_EVENT_ORDER_INVALID',
    ORDER_DUPLICATED = 'ERROR_EVENT_ORDER_DUPLICATED',
}

const EventSchema = new Schema({
    name: {
        type: String,
        required: [true, EventErrors.NAME_REQUIRED],
    },
    //TODO: Convert to Epoch
    date: {
        type: Date,
        required: [true, EventErrors.DATE_REQUIRED],
    },
    orders: {
        type: [{ type: Schema.Types.ObjectId, ref: Statics.ORDER_COLLECTION_NAME }],
        default: [],
        validate: validateEventOrders,
    },
    isOpen: {
        type: Boolean,
        default: false,
    },
});

const EventModel = model(Statics.EVENT_COLLECTION_NAME, EventSchema);

export default EventModel;

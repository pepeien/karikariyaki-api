import { PopulateOptions } from 'mongoose';
import {
    EventCreatableParams,
    EventEditableParams,
    EventQueryableParams,
    Operator,
    OperatorRole,
} from 'karikarihelper';

// Models
import { EventModel, OperatorErrors, OrderModel } from '@models';

// Services
import { DatabaseService, DateService, StringService } from '@services';
import { InHouseError } from '@types';

export class EventService {
    public static visibleParameters = ['name', 'date', 'orders', 'isOpen'];

    private static _populateOptions = {
        path: 'orders',
        select: ['status', 'client'],
        populate: [
            {
                path: 'operator',
                select: 'displayName',
            },
            {
                path: 'realm',
                select: 'name',
            },
            {
                path: 'items',
                select: 'name',
            },
        ],
    } as PopulateOptions;

    public static async query(values: EventQueryableParams, populate = true) {
        await DatabaseService.getConnection();

        await EventService._fixEventsStatus();

        const query = [];

        if (values.id) {
            query.push({
                _id: values.id,
            });
        }

        if (values.name) {
            query.push({
                name: DatabaseService.generateBroadQuery(values.name),
            });
        }

        if (values.date) {
            query.push({
                date: DatabaseService.generateStandarizedDateQuery(values.date),
            });
        }

        if (values.isOpen !== null && values.isOpen !== undefined) {
            query.push({
                isOpen: values.isOpen,
            });
        }

        if (populate) {
            return EventModel.find(query.length === 0 ? null : { $and: query })
                .select(EventService.visibleParameters)
                .populate(EventService._populateOptions);
        }

        return EventModel.find(query.length === 0 ? null : { $and: query }).select(
            EventService.visibleParameters,
        );
    }

    public static async queryById(id: string) {
        await DatabaseService.getConnection();

        return EventModel.findById(id)
            .select(EventService.visibleParameters)
            .populate(EventService._populateOptions);
    }

    //TODO: Convert to Epoch
    public static async save(operator: Operator, values: EventCreatableParams) {
        if (EventService._canPerformModifications(operator)) {
            throw new InHouseError(OperatorErrors.FORBIDDEN, 403);
        }

        await DatabaseService.getConnection();

        const newEntry = new EventModel();

        newEntry.name = values.name.trim();
        newEntry.date = DateService.standarizeCurrentDate(new Date(values.date));
        newEntry.isOpen = DateService.isToday(newEntry.date);

        await newEntry.save();

        return EventModel.findById(newEntry._id)
            .select(EventService.visibleParameters)
            .populate(EventService._populateOptions);
    }

    public static async update(operator: Operator, id: string, values: EventEditableParams) {
        if (EventService._canPerformModifications(operator)) {
            throw new InHouseError(OperatorErrors.FORBIDDEN, 403);
        }

        await DatabaseService.getConnection();

        values.name = values.name?.trim();

        return EventModel.findByIdAndUpdate(
            StringService.toObjectId(id),
            {
                $set: {
                    name: values.name,
                    isOpen: values.isOpen,
                },
            },
            { new: true, runValidators: true, setDefaultsOnInsert: false },
        )
            .select(EventService.visibleParameters)
            .populate(EventService._populateOptions);
    }

    public static async delete(operator: Operator, id: string) {
        if (EventService._canPerformModifications(operator)) {
            throw new InHouseError(OperatorErrors.FORBIDDEN, 403);
        }

        await DatabaseService.getConnection();

        const eventId = StringService.toObjectId(id);

        await OrderModel.deleteMany({
            event: eventId,
        });

        return EventModel.findByIdAndDelete(eventId)
            .select(EventService.visibleParameters)
            .populate(EventService._populateOptions);
    }

    private static _canPerformModifications(operator: Operator) {
        return operator.role !== OperatorRole.ADMIN;
    }

    //TODO: Convert to Epoch
    private static async _fixEventsStatus() {
        const foundEvents = await EventModel.find().select(EventService.visibleParameters);

        for (const foundEvent of foundEvents) {
            if (foundEvent.isOpen === DateService.isToday(foundEvent.date)) {
                continue;
            }

            await EventModel.findByIdAndUpdate(foundEvent._id, {
                isOpen: !foundEvent.isOpen,
            });
        }
    }
}

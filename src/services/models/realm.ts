import {
    Operator,
    OperatorRole,
    Realm,
    RealmCreatableParams,
    RealmEditableParams,
    RealmQueryableParams,
} from 'karikarihelper';

// Types
import { InHouseError, Statics } from '@types';
import { OperatorErrors, RealmModel } from '@models';

// Services
import { DatabaseService, StringService } from '@services';
import { PopulateOptions } from 'mongoose';

let adminRealm: Realm | null = null;

export class RealmService {
    public static visibleParameters = ['name', 'users'];

    private static _populateOptions = [
        {
            path: 'users',
            select: ['displayName', 'role'],
        },
    ] as PopulateOptions[];

    public static async query(operator: Operator, values: RealmQueryableParams) {
        await DatabaseService.getConnection();

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

        if (operator.role !== OperatorRole.ADMIN) {
            query.push({
                _id: operator.realm._id,
            });
        }

        return RealmModel.find<Realm>(query.length === 0 ? null : { $and: query })
            .select(RealmService.visibleParameters)
            .populate(RealmService._populateOptions);
    }

    public static async queryId(id: string) {
        await DatabaseService.getConnection();

        return RealmModel.findById(StringService.toObjectId(id))
            .select(RealmService.visibleParameters)
            .populate(RealmService._populateOptions);
    }

    public static async getAdminRealm() {
        if (!adminRealm) {
            const foundRealm = await RealmModel.findOne({
                name: Statics.REALM_ADMIN_NAME,
            })
                .select(RealmService.visibleParameters)
                .populate(RealmService._populateOptions);

            adminRealm = foundRealm.toObject<Realm>();
        }

        return adminRealm;
    }

    public static async save(operator: Operator, values: RealmCreatableParams) {
        if (RealmService._canPerformModifications(operator)) {
            throw new InHouseError(OperatorErrors.FORBIDDEN, 403);
        }

        await DatabaseService.getConnection();

        const newEntry = new RealmModel();

        newEntry.name = values.name.trim();

        await newEntry.save();

        return RealmModel.findById(newEntry._id)
            .select(RealmService.visibleParameters)
            .populate(RealmService._populateOptions);
    }

    public static async update(operator: Operator, id: string, values: RealmEditableParams) {
        if (RealmService._canPerformModifications(operator)) {
            throw new InHouseError(OperatorErrors.FORBIDDEN, 403);
        }

        await DatabaseService.getConnection();

        values.name = values.name?.trim();

        return RealmModel.findByIdAndUpdate(
            StringService.toObjectId(id),
            {
                $set: {
                    name: values.name?.trim(),
                },
            },
            { runValidators: true },
        )
            .select(RealmService.visibleParameters)
            .populate(RealmService._populateOptions);
    }

    public static async delete(operator: Operator, id: string) {
        if (RealmService._canPerformModifications(operator)) {
            throw new InHouseError(OperatorErrors.FORBIDDEN, 403);
        }

        await DatabaseService.getConnection();

        const realmObjectId = StringService.toObjectId(id);

        return RealmModel.findByIdAndDelete(realmObjectId)
            .select(RealmService.visibleParameters)
            .populate(RealmService._populateOptions);
    }

    private static _canPerformModifications(operator: Operator) {
        return operator.role !== OperatorRole.ADMIN;
    }
}

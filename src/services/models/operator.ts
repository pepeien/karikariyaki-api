import { PopulateOptions } from 'mongoose';
import {
    Operator,
    OperatorCreatableParams,
    OperatorEditableParams,
    OperatorQueryableParams,
    OperatorRole,
} from 'karikarihelper';

// Types
import { OperatorErrors, OperatorModel } from '@models';
import { InHouseError } from '@types';

// Services
import { DatabaseService, RealmService, StringService } from '@services';

let adminOperator: Operator | null = null;

export class OperatorService {
    public static visibleParameters = ['displayName', 'role', 'realm', 'photo'];

    private static _populateOptions = {
        path: 'realm',
        select: 'name',
    } as PopulateOptions;
    private static _validRoles = Object.values(OperatorRole);

    public static getAvailableRolesByRole(role: OperatorRole): string[] {
        switch (role) {
            case OperatorRole.ADMIN:
                return OperatorService._validRoles;

            case OperatorRole.MANAGER:
                return OperatorService._validRoles.filter((role) => role === OperatorRole.WORKER);

            case OperatorRole.WORKER:
                return [];

            default:
                return [];
        }
    }

    public static async query(operator: Operator, values: OperatorQueryableParams) {
        await DatabaseService.getConnection();

        const query = [];

        if (values.id) {
            query.push({
                _id: StringService.toObjectId(values.id),
            });
        }

        if (values.displayName) {
            query.push({
                displayName: DatabaseService.generateBroadQuery(values.displayName),
            });
        }

        let realmQuery = {
            realm: StringService.toObjectId(operator.realm._id),
        };

        if (operator.role === OperatorRole.ADMIN) {
            realmQuery = null;

            if (values.realmId) {
                realmQuery = {
                    realm: StringService.toObjectId(values.realmId),
                };
            }
        }

        if (realmQuery) {
            query.push(realmQuery);
        }

        return OperatorModel.find(query.length === 0 ? null : { $and: query })
            .select(OperatorService.visibleParameters)
            .populate(OperatorService._populateOptions);
    }

    public static async queryById(id: string) {
        await DatabaseService.getConnection();

        return OperatorModel.findById(id)
            .select(OperatorService.visibleParameters)
            .populate(OperatorService._populateOptions);
    }

    public static async getAdminOperator() {
        if (!adminOperator) {
            const foundOperator = await OperatorModel.findOne({
                userName: process.env.ADMIN_USER_NAME,
            })
                .select(OperatorService.visibleParameters)
                .populate(OperatorService._populateOptions);

            adminOperator = foundOperator.toObject<Operator>();
        }

        return adminOperator;
    }

    public static async queryByUserName(userName: string) {
        await DatabaseService.getConnection();

        return OperatorModel.findOne({ userName: userName })
            .select(OperatorService.visibleParameters)
            .populate(OperatorService._populateOptions);
    }

    public static async save(operator: Operator, values: OperatorCreatableParams) {
        const isRoleInvalid = !OperatorService.getAvailableRolesByRole(operator.role).find(
            (role) => role === values.role.trim(),
        );

        if (isRoleInvalid) {
            throw new InHouseError(OperatorErrors.FORBIDDEN, 403);
        }

        await DatabaseService.getConnection();

        const newEntry = new OperatorModel();

        newEntry.userName = values.userName;
        newEntry.displayName = values.displayName;
        newEntry.realm = StringService.toObjectId(
            operator.role === OperatorRole.ADMIN && values.realmId
                ? values.realmId
                : operator.realm._id,
        );
        newEntry.role = values.role.trim();
        newEntry.photo = values.photo;

        const adminRealm = await RealmService.getAdminRealm();

        const isAdminRealm = values.realmId && values.realmId === adminRealm._id.toString();
        const isAdminRole = values.role && values.role === OperatorRole.ADMIN;

        if (isAdminRealm || isAdminRole) {
            newEntry.realm = StringService.toObjectId(adminRealm._id);
        }

        await newEntry.save();

        return OperatorModel.findById(newEntry._id)
            .select(OperatorService.visibleParameters)
            .populate(OperatorService._populateOptions);
    }

    public static async update(operator: Operator, id: string, values: OperatorEditableParams) {
        const isRoleInvalid =
            values.role &&
            !OperatorService.getAvailableRolesByRole(operator.role).find(
                (role) => role === values.role.trim(),
            );

        if (isRoleInvalid) {
            throw new InHouseError(OperatorErrors.FORBIDDEN, 403);
        }

        await DatabaseService.getConnection();

        if (operator.role !== OperatorRole.ADMIN) {
            const foundOperator = await OperatorService.queryById(id);

            if (operator.realm._id.toString() !== foundOperator.realm._id.toString()) {
                throw new InHouseError(OperatorErrors.FORBIDDEN, 403);
            }
        }

        values.displayName = values.displayName?.trim() ?? undefined;
        values.role = values.role?.trim() ?? undefined;
        values.photo = values.photo ?? undefined;

        return OperatorModel.findByIdAndUpdate(
            StringService.toObjectId(id),
            {
                $set: {
                    displayName: values.displayName,
                    role: values.role,
                    photo: values.photo,
                },
            },
            { runValidators: true },
        )
            .select(OperatorService.visibleParameters)
            .populate(OperatorService._populateOptions);
    }

    public static async delete(operator: Operator, id: string) {
        await DatabaseService.getConnection();

        if (operator.role !== OperatorRole.ADMIN) {
            const foundOperator = await OperatorService.queryById(id);

            if (operator.realm._id.toString() !== foundOperator.realm._id.toString()) {
                throw new InHouseError(OperatorErrors.FORBIDDEN, 403);
            }
        }

        return OperatorModel.findByIdAndDelete(StringService.toObjectId(id))
            .select(OperatorService.visibleParameters)
            .populate(OperatorService._populateOptions);
    }
}

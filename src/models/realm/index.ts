import { Schema, model } from 'mongoose';
import { OperatorRole } from 'karikarihelper';

// Types
import { Statics } from '@types';

// Models
import { OperatorModel } from '@models';

// Validators
import { validateRealmName } from './validators';

// Services
import { OperatorService } from '@services';

export enum RealmErrors {
    INVALID = 'ERROR_REALM_INVALID',
    NAME_DUPLICATED = 'ERROR_REALM_NAME_DUPLICATED',
    NAME_GREATER_THAN_MAX_LENGTH = 'ERROR_REALM_NAME_GREATER_THAN_MAX_LENGTH',
    NAME_LESS_THAN_MIN_LENGTH = 'ERROR_REALM_NAME_LESS_THAN_MIN_LENGTH',
    NAME_REQUIRED = 'ERROR_REALM_NAME_REQUIRED',
    NOT_FOUND = 'ERROR_REALM_NOT_FOUND',
}

const RealmSchema = new Schema({
    name: {
        type: String,
        required: [true, RealmErrors.NAME_REQUIRED],
        validate: validateRealmName,
    },
    users: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: Statics.OPERATOR_COLLECTION_NAME,
            },
        ],
        default: [],
    },
});

const RealmModel = model(Statics.REALM_COLLECTION_NAME, RealmSchema);

RealmModel.findOne({
    name: Statics.REALM_ADMIN_NAME,
})
    .then(async (foundRealm) => {
        if (foundRealm) {
            return;
        }

        const adminRealm = new RealmModel();

        adminRealm.name = Statics.REALM_ADMIN_NAME;

        await adminRealm.save();

        const adminUserName = process.env.ADMIN_USER_NAME;

        const foundOperator = await OperatorService.getAdminOperator();

        if (foundOperator) {
            await OperatorModel.findByIdAndUpdate(foundOperator._id, {
                realm: adminRealm._id,
            });

            return;
        }

        const adminOperator = new OperatorModel();

        adminOperator.userName = adminUserName;
        adminOperator.displayName = Statics.OPERATOR_ADMIN_DISPLAY_NAME;
        adminOperator.realm = adminRealm._id;
        adminOperator.role = OperatorRole.ADMIN;

        await adminOperator.save();
    })
    .catch((error) => {
        console.log(error);
    });

export default RealmModel;

import db from '../../models';
import IPermissionDao from '../contracts/IPermissionDao';
import SuperDao from './SuperDao';

const { permission: Permission } = db;

export default class PermissionDao extends SuperDao implements IPermissionDao {
    constructor() {
        super(Permission);
    }

    async findPermission(module_id: string, action_id: string) {
        return Permission.findOne({
            where: { module_id, action_id }
        });
    }

    async createNewPermission(module_id: string, action_id: string, t) {
        return Permission.create({
            moduleId: module_id,
            actionId: action_id
        }, { transaction: t });
    }
}

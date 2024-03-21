import { mixPermissions } from '../../helper/mixPermissions';
import models, { sequelize } from '../../models';
import IRoleDao from '../contracts/IRoleDao';
import SuperDao from './SuperDao';
import { Op } from 'sequelize';

const { role: Role, model: Model, action: Action, permission: Permission, role_permission: RolePermission } = models;

export default class RoleDao extends SuperDao implements IRoleDao {
    constructor() {
        super(Role);
    }

    async isRoleExists(id: string) {
        return Role.count({ where: { id } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    }

    async isRoleNameExists(name: string) {
        return Role.count({ where: { name } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    }

    async findByOtherRoleName(id: string, name: string) {
        return Role.findOne({
            where: {
                name: name,
                [Op.not]: { id: id },
            }
        });
    }

    async isRoleLevelExists(level: number) {
        return Role.count({ where: { level } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    }

    async getRoleWithPermissions(id: string) {
        const getActionsData = await Action.findAll({ attributes: ['code'], raw: true });
        const actions = getActionsData.map(action => action.code);
        const attributes = [
            [sequelize.literal('"permissions->model"."id"'), 'module_id'],
            [sequelize.literal('"permissions->model"."name"'), 'module_name'],
            ...actions.map(action => [
                sequelize.literal(`(CASE WHEN "permissions->action"."code" = '${action}' THEN true ELSE false END)`),
                action,
            ]),
        ];

        const separatedPermissionRole = await Role.findOne({
            attributes: {
                exclude: ['deleted_at']
            },
            include: [{
                model: Permission,
                through: {
                    model: RolePermission,
                    attributes: [],
                },
                include: [
                    {
                        model: Model,
                        attributes: []
                    },
                    {
                        model: Action,
                        attributes: []
                    },
                ],
                attributes: attributes,
            }],
            where: { id: id },
        });

        const mixedPermissionRole = separatedPermissionRole.toJSON();
        mixedPermissionRole.permissions = await mixPermissions(mixedPermissionRole.permissions);
        return { separatedPermissionRole, mixedPermissionRole };
    }
}

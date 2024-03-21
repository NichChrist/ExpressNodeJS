/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
import httpStatus from 'http-status';
import { v4 as uuid } from 'uuid';
import { Request } from 'express';
import responseHandler from '../../helper/responseHandler';
import RoleDao from '../../dao/implementations/RoleDao';
import PermissionDao from '../../dao/implementations/PermissionDao';
import ModelDao from '../../dao/implementations/ModelDao';
import IRoleService from '../contracts/IRoleService';
import { IRole } from '../../models/interfaces/IRole';
import { IPermission } from '../../models/interfaces/IPermission';
import models, { sequelize } from '../../models';

const { role: Role, action: Action } = models;

export default class RoleService implements IRoleService {
    private roleDao: RoleDao;
    private modelDao: ModelDao;
    private permissionDao: PermissionDao;

    constructor() {
        this.roleDao = new RoleDao();
        this.modelDao = new ModelDao();
        this.permissionDao = new PermissionDao();
    }

    getRolesData = async (req: Request) => {
        try {
            const pagination = req.query.pagination;
            let options = {
                attributes: {
                    exclude: ['deleted_at']
                },
                order: [
                    ['level', 'ASC'],
                    ['created_at', 'DESC']
                ]
            };
            if (pagination == 'true') {
                const row: any = req.query.row;
                const page: any = req.query.page;
                const offset = (page - 1) * row;
                options['offset'] = offset;
                options['limit'] = row;
            }
            const allData = await Role.findAndCountAll(options);
            return responseHandler.returnSuccess(httpStatus.OK, 'Roles retrieved successfully', allData);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Retrieving Roles Failed');
        }
    }

    getRoleDataById = async (id: string) => {
        try {
            const message = 'Successfully Fetch A Role Data';
            if (!(await this.roleDao.isRoleExists(id))) return responseHandler.returnError(httpStatus.NOT_FOUND, 'Role Not Found');

            const { mixedPermissionRole } = await this.roleDao.getRoleWithPermissions(id);

            return responseHandler.returnSuccess(httpStatus.OK, message, mixedPermissionRole);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something Went Wrong');
        }
    }

    createNewRole = async (roleBody: IRole, permissions: IPermission[]) => {
        try {
            if (await this.roleDao.isRoleNameExists(roleBody.name)) return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Role with this name already exists');

            if (permissions) {
                for (let i = 0; i < permissions.length; i++) {
                    // check whether model with this ID AND name exist
                    const model = await this.modelDao.getModelNameById(permissions[i].model_id, permissions[i].model_name);
                    if (!model) return responseHandler.returnError(httpStatus.NOT_FOUND, 'Invalid model ID(s) or Name');
                }
            }

            if (!roleBody.level) {
                // If level not included in body, then find level that not exist yet in table
                const existingLevels = await Role.findAll({
                    attributes: ['level'],
                    raw: true,
                });

                let newLevel = 1;
                while (existingLevels.some((levelObj) => levelObj.level === newLevel)) newLevel++;
                roleBody.level = newLevel;
            } else {
                // Check if level from body already exist in table
                if (await this.roleDao.isRoleLevelExists(roleBody.level)) return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Role with this level already exists');
            }

            const id = uuid();
            roleBody.id = id;

            await sequelize.transaction(async (t) => {
                // Step 1: Create Role, then stop here if there is no permissions in request body
                const createdRole = await Role.create(roleBody, { transaction: t });

                // Proceed to Step 2 if permissions exist in the request body
                if (permissions) {
                    // Get actions data as array of string ([create, read, update, delete, ...])
                    const getActionsData = await Action.findAll({ attributes: ['code'], raw: true });
                    const actions = getActionsData.map(action => action.code);
                    const addPermissionIds: string[] = [];
                    // Step 2: Loop to assign permissions to newly created role
                    for (const permission of permissions) {
                        const { model_id, model_name } = permission;

                        if (model_name !== "user" && (permission.change_password || permission.reset_password)) {
                            delete permission.change_password;
                            delete permission.reset_password;
                        }

                        // Step 3: Create permission for every true value in actions 
                        for (const action of actions) {
                            if (permission[action]) {
                                // Step 4: Find permission between model and action
                                const actionData = await Action.findOne({ where: { code: action }, raw: true });
                                const existingPermission = await this.permissionDao.findPermission(model_id, actionData.id);

                                if (!existingPermission) {
                                    // If there is no permission between model and action, then create a new one. After that, push permission id to addPermissionIds
                                    const newPermission = await this.permissionDao.createNewPermission(model_id, actionData.id, t);
                                    addPermissionIds.push(newPermission.dataValues.id);
                                } else {
                                    // If permission between model and action already exists, then just push permission id to addPermissionIds
                                    addPermissionIds.push(existingPermission.id)
                                }
                            }
                        }
                    }
                    // Step 5: After obtaining arrays of permission IDs to be added, proceed with adding the role permissions
                    await createdRole.addPermissions(addPermissionIds, { transaction: t });
                }
            });

            const { mixedPermissionRole } = await this.roleDao.getRoleWithPermissions(id);

            return responseHandler.returnSuccess(httpStatus.CREATED, 'Successfully Create Role', mixedPermissionRole);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something Went Wrong');
        }
    }

    deleteRoleById = async (id: string) => {
        try {
            if (!(await this.roleDao.isRoleExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'Role Not Found');
            }
            const role = await Role.findByPk(id);
            role.setUsers([]);
            role.setPermissions([]);
            await Role.destroy({ where: { id: id } });
            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Delete Role');
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something Went Wrong');
        }
    }

    // updateRoleById = async (id: string, name: string, permissions: IPermission[]) => {
    updateRoleById = async (req: Request) => {
        try {
            const id = req.params.id;
            const { name, permissions } = req.body;
            if (!(await this.roleDao.isRoleExists(id))) return responseHandler.returnError(httpStatus.NOT_FOUND, 'Role Not Found');

            if (name && await this.roleDao.findByOtherRoleName(id, name)) return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Role with this name already exists');

            if (permissions) {
                for (let i = 0; i < permissions.length; i++) {
                    let model = await this.modelDao.getModelNameById(permissions[i].model_id, permissions[i].model_name)
                    // check whether model with this ID AND name exist
                    if (!model) return responseHandler.returnError(httpStatus.NOT_FOUND, 'Invalid model ID(s) or Name');
                };
            };

            // Update process
            await sequelize.transaction(async (t) => {
                // Step 1: Update role name
                await Role.update(
                    { name: name },
                    { where: { id: id } },
                    { transaction: t }
                );
                // Proceed to Step 2 if permissions exist in the request body
                if (permissions) {
                    // Step 2: Get role data
                    const { mixedPermissionRole, separatedPermissionRole } = await this.roleDao.getRoleWithPermissions(id);

                    // Step 3: Get permissions data (result is array of IPermission[]) from role data
                    const oldPermissions: IPermission[] = mixedPermissionRole.permissions;

                    // Get actions data as array of string ([create, read, update, delete, ...])
                    const getActionsData = await Action.findAll({ attributes: ['code'], raw: true });
                    const actions = getActionsData.map(action => action.code);

                    const addPermissionIds: string[] = [];
                    const removePermssionIds: string[] = [];
                    // Step 4: For every new permissions data (from body), find if its already exist in the old permissions
                    for (const permission of permissions) {
                        const { model_id, model_name } = permission;

                        // filter out change_password and reset_password if model is not user
                        const usedActions = model_name !== 'user'
                            ? actions.filter(item => item !== 'change_password' && item !== 'reset_password')
                            : actions;

                        // Step 5: Determine whether this permission model already exists in the old permissions data
                        const isOldPermissionsExist = oldPermissions.find(item => item.model_id === model_id);

                        if (isOldPermissionsExist) {
                            // Step 5a: If this permission is found in the old permissions, then update the old permission
                            for (const action of usedActions) {
                                // Get action and permission data
                                const actionData = await Action.findOne({ where: { code: action }, raw: true });
                                const existingPermission = await this.permissionDao.findPermission(model_id, actionData.id);

                                if (!existingPermission) {
                                    // If there is no permission between model and action, then create a new one
                                    // after that, push permission id to addPermissionIds
                                    const newPermission = await this.permissionDao.createNewPermission(model_id, actionData.id, t);
                                    addPermissionIds.push(newPermission.dataValues.id as string);
                                } else {
                                    // If new action is true, but the old one is false, then create a new permission from this role
                                    // Note: push permission id to addPermissionIds
                                    if (permission[action] && !isOldPermissionsExist[action]) addPermissionIds.push(existingPermission.id);

                                    // If new action is false, but the old one is true, then remove that permission from this role
                                    // Note: push permission id to removePermssionIds
                                    if (!permission[action] && isOldPermissionsExist[action]) removePermssionIds.push(existingPermission.id);
                                }
                            }
                        } else {
                            // Step 5b: If not found, create new role permission
                            for (const action of usedActions) {
                                // Create permission for every true value in actions. If action value is false, then skip this
                                if (permission[action]) {
                                    // Get action and permission data
                                    const actionData = await Action.findOne({ where: { code: action }, raw: true });
                                    const existingPermission = await this.permissionDao.findPermission(model_id, actionData.id);

                                    if (!existingPermission) {
                                        // If there is no permission between model and action, then create a new one. After that, push permission id to addPermissionIds
                                        const newPermission = await this.permissionDao.createNewPermission(model_id, actionData.id, t);
                                        addPermissionIds.push(newPermission.id);
                                    } else {
                                        // If permission between model and action already exists, then just push permission id to addPermissionIds
                                        addPermissionIds.push(existingPermission.id);
                                    };
                                };
                            };
                        };
                    };
                    // Step 6: After obtaining arrays of permission IDs to be added or removed, proceed with updating the role permissions
                    await separatedPermissionRole.addPermissions(addPermissionIds, { transaction: t });
                    await separatedPermissionRole.removePermissions(removePermssionIds, { transaction: t });
                };
            });

            const { mixedPermissionRole } = await this.roleDao.getRoleWithPermissions(id);

            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Update Role', mixedPermissionRole);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something Went Wrong');
        }
    }

    reorderByIds = async (ids: string[]) => {
        try {
            const totalData = await Role.count();
            if (ids.length !== totalData) return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Number of roles does not match');

            const findDuplicates = ids => ids.filter((id, i) => ids.indexOf(id) !== i);

            if (findDuplicates(ids).length !== 0) return responseHandler.returnError(httpStatus.BAD_REQUEST, "ID cannot be duplicates");

            const rolesExist = await Promise.all(ids.map(id => this.roleDao.isRoleExists(id)));
            if (!rolesExist.every(Boolean)) return responseHandler.returnError(httpStatus.NOT_FOUND, 'Role Not Found');

            await sequelize.transaction(async (t) => {
                for (let i = 0; i < totalData; i++) {
                    await Role.update(
                        { level: i + 1 },
                        { where: { id: ids[i] } },
                        { transaction: t }
                    )
                }
            })

            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Reorder Role');
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something Went Wrong');
        }
    }
}

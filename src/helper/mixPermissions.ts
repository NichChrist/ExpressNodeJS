import { IPermission } from "../models/interfaces/IPermission";
import models from '../models';
const { action: Action } = models;

export const mixPermissions = async (permissions: IPermission[]) => {
    const getActionsData = await Action.findAll({ attributes: ['code'], raw: true });
    const actions = getActionsData.map(action => action.code);
    const mixedPermissions = {};
    permissions.forEach(permission => {
        const { module_id, module_name } = permission;

        const usedActions = module_name !== 'user'
            ? actions.filter(module => module !== 'change_password' && module !== 'reset_password')
            : actions;

        if (!mixedPermissions[module_name]) {
            mixedPermissions[module_name] = { module_id, module_name };
            usedActions.forEach(action => mixedPermissions[module_name][action] = false);
        }

        usedActions.forEach(action => mixedPermissions[module_name][action] = mixedPermissions[module_name][action] || permission[action]);
    });
    const result: IPermission[] = Object.values(mixedPermissions);
    return result;
}
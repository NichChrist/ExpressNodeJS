import { IPermission } from "../models/interfaces/IPermission";
import models from '../models';
const { action: Action } = models;

export const mixPermissions = async (permissions: IPermission[]) => {
    const getActionsData = await Action.findAll({ attributes: ['code'], raw: true });
    const actions = getActionsData.map(action => action.code);
    const mixedPermissions = {};
    permissions.forEach(permission => {
        const { model_id, model_name } = permission;

        const usedActions = model_name !== 'user'
            ? actions.filter(model => model !== 'change_password' && model !== 'reset_password')
            : actions;

        if (!mixedPermissions[model_name]) {
            mixedPermissions[model_name] = { model_id, model_name };
            usedActions.forEach(action => mixedPermissions[model_name][action] = false);
        }

        usedActions.forEach(action => mixedPermissions[model_name][action] = mixedPermissions[model_name][action] || permission[action]);
    });
    const result: IPermission[] = Object.values(mixedPermissions);
    return result;
}
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import RoleDao from '../dao/implementations/RoleDao';
import { IPermission } from '../models/interfaces/IPermission';
import { mixPermissions } from '../helper/mixPermissions';
import models from '../models';
const { user: User } = models;

let roleDao: RoleDao = new RoleDao();

const getPermissions = async (userId: string) => {
    let user = await User.findOne({ where: { id: userId } });

    const roles = await user.getRoles({
        attributes: ['id'],
        joinTableAttributes: [],
        raw: true,
    });

    let rawAllPermissions: IPermission[] = [];

    for (let i = 0; i < roles.length; i++) {
        const { mixedPermissionRole } = await roleDao.getRoleWithPermissions(roles[i].id);
        rawAllPermissions = rawAllPermissions.concat(mixedPermissionRole.permissions);
    };

    return mixPermissions(rawAllPermissions);
};

export const checkingPermission = (moduleName: string, actionName: string) => async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userInfo!.id;
    const allPermissions = await getPermissions(userId);
    if (allPermissions.length === 0) {
        return res.status(httpStatus.FORBIDDEN).json({
            code: httpStatus.FORBIDDEN,
            message: 'You Have No Permission'
        });
    }

    const userPermission = allPermissions.find(permission => permission.model_name === moduleName);

    if (!userPermission?.[actionName]) {
        return res.status(httpStatus.FORBIDDEN).json({
            code: httpStatus.FORBIDDEN,
            message: 'You Have No Permission'
        });
    }

    next();
};
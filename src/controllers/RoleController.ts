import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { logger } from '../config/logger';
import RoleService from '../service/implementations/RoleService';

export default class RoleController {

    private roleService: RoleService;

    constructor() {
        this.roleService = new RoleService();
    }

    getRolesData = async (req: Request, res: Response) => {
        try {
            const role = await this.roleService.getRolesData(req);
            const { code, message } = role.response;
            const data: any = role.response.data;

            res.status(role.statusCode).json({
                code: code,
                message: message,
                count: data.count,
                data: data.rows,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                code: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong',
            });
        }
    }

    getRolesDataById = async (req: Request, res: Response) => {
        try {
            const role = await this.roleService.getRoleDataById(req.params.id)
            const { code, message, data } = role.response;
            res.status(role.statusCode).json({
                code: code,
                message: message,
                data: data,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                code: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong',
            });
        }
    }

    createRole = async (req: Request, res: Response) => {
        try {
            const role = await this.roleService.createNewRole(req.body, req.body.permissions)
            const { code, message, data } = role.response;
            res.status(role.statusCode).json({
                code: code,
                message: message,
                data: data,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                code: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong'
            })
        }
    }

    deleteRole = async (req: Request, res: Response) => {
        try {
            const role = await this.roleService.deleteRoleById(req.params.id)
            const { code, message } = role.response;
            res.status(role.statusCode).json({
                code: code,
                message: message,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                code: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong'
            })
        }
    }

    updateRole = async (req: Request, res: Response) => {
        try {
            const role = await this.roleService.updateRoleById(req);
            const { code, message, data } = role.response;
            res.status(role.statusCode).json({
                code: code,
                message: message,
                data: data,
            })
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                code: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong'
            })
        }
    }

    reorderRoles = async (req: Request, res: Response) => {
        try {
            const role = await this.roleService.reorderByIds(req.body.role_id);
            const { code, message } = role.response;
            res.status(role.statusCode).json({
                code: code,
                message: message,
            })
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                code: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong'
            })
        }
    }
}

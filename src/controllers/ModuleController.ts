import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { logger } from '../config/logger';
import ModuleService from '../service/implementations/ModuleService';

export default class ModuleController {

    private moduleService: ModuleService;

    constructor() {
        this.moduleService = new ModuleService();
    }

    getModulesData = async (req: Request, res: Response) => {
        try {
            const module = await this.moduleService.getModulesData(req);
            const { code, message } = module.response;
            const data: any = module.response.data;

            res.status(module.statusCode).json({
                code: code,
                message: message,
                count: data.count,
                data: data.rows,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                status: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong',
            });
        }
    };

    getModulesDataById = async (req: Request, res: Response) => {
        try {
            const data = await this.moduleService.getModulesById(req.params.id)
            const { code, message } = data.response;
            const role = data.response.data;
            res.status(data.statusCode).json({
                code: code,
                message: message,
                data: role,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                error: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong',
            });
        }
    };

    createModule = async (req: Request, res: Response) => {
        try {
            const data = await this.moduleService.createNewModule(req.body.name)
            const { code, message } = data.response;
            const module = data.response.data;
            res.status(data.statusCode).json({
                code: code,
                message: message,
                data: module,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                error: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong'
            })
        }
    }

    deleteModule = async (req: Request, res: Response) => {
        try {
            const data = await this.moduleService.deleteModuleById(req.params.id)
            const { code, message } = data.response;
            res.status(data.statusCode).json({
                code: code,
                message: message,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                error: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong'
            })
        }
    }

    updateModule = async (req: Request, res: Response) => {
        try {
            const data = await this.moduleService.updateModuleById(req.params.id, req.body.name);
            const { code, message } = data.response;
            const module = data.response.data;
            res.status(data.statusCode).json({
                code: code,
                message: message,
                data: module
            })
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                error: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong'
            })
        }
    }
}

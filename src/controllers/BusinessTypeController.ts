import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { logger } from '../config/logger';
import BusinessService from '../service/implementations/BusinessTypeService';
import BusinessTypeService from '../service/implementations/BusinessTypeService';

export default class BusinessTypeController {

    private businessTypeService: BusinessTypeService;

    constructor() {
        this.businessTypeService = new BusinessTypeService();
    }

    getBusinessTypesData = async (req: Request, res: Response) => {
        try {
            const model = await this.businessTypeService.getBusinessTypesData(req);
            const { code, message } = model.response;
            const data: any = model.response.data;

            res.status(model.statusCode).json({
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

    getBusinessTypesDataById = async (req: Request, res: Response) => {
        try {
            const data = await this.businessTypeService.getBusinessTypeById(req.params.id)
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

    createBusinessType = async (req: Request, res: Response) => {
        try {
            const data = await this.businessTypeService.createNewBusinessType(req.body.name)
            const { code, message } = data.response;
            const model = data.response.data;
            res.status(data.statusCode).json({
                code: code,
                message: message,
                data: model,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                error: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong'
            })
        }
    }

    deleteBusinessType = async (req: Request, res: Response) => {
        try {
            const data = await this.businessTypeService.deleteBusinessTypeById(req.params.id)
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

    updateBusinessType = async (req: Request, res: Response) => {
        try {
            const data = await this.businessTypeService.updateBusinessTypeById(req.params.id, req.body.name);
            const { code, message } = data.response;
            const model = data.response.data;
            res.status(data.statusCode).json({
                code: code,
                message: message,
                data: model
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

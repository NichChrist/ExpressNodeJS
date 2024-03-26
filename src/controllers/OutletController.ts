import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { logger } from '../config/logger';
import OutletService from '../service/implementations/OutletService';

export default class OutletController {

    private outletService: OutletService;

    constructor() {
        this.outletService = new OutletService();
    }

    getOutletsData = async (req: Request, res: Response) => {
        try {
            const Outlet = await this.outletService.getOutletsData(req);
            const { code, message } = Outlet.response;
            const data: any = Outlet.response.data;

            res.status(Outlet.statusCode).json({
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

    getOutletsDataById = async (req: Request, res: Response) => {
        try {
            const data = await this.outletService.getOutletDataById(req.params.id)
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

    createOutlet = async (req: Request, res: Response) => {
        try {
            const data = await this.outletService.createNewOutlet(req.body, req)
            const { code, message } = data.response;
            const Outlet = data.response.data;
            res.status(data.statusCode).json({
                code: code,
                message: message,
                data: Outlet,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                error: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong'
            })
        }
    }

    deleteOutlet = async (req: Request, res: Response) => {
        try {
            const data = await this.outletService.deleteOutletById(req.params.id)
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

    updateOutlet = async (req: Request, res: Response) => {
        try {
            const data = await this.outletService.updateOutletById(req.body, req.params.id);
            const { code, message } = data.response;
            const Outlet = data.response.data;
            res.status(data.statusCode).json({
                code: code,
                message: message,
                data: Outlet
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

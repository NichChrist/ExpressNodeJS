import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { logger } from '../config/logger';
import OutletService from '../service/implementations/OutletService';

export default class OutletController {

    private outletService: OutletService;

    constructor() {
        this.outletService = new OutletService();
    }

    listOutlets = async (req: Request, res: Response) => {
        try {
            const users = await this.outletService.listOutlet(req.query);
            const { message, data } = users.response;
            const code = users.statusCode;
            res.status(code).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    dropdown = async (req: Request, res: Response) => {
        try {
            const users = await this.outletService.dropdownOutlet();
            const { message, data } = users.response;
            const code = users.statusCode;
            res.status(code).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
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
            const data = await this.outletService.createNewOutlet(req, req.body)
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

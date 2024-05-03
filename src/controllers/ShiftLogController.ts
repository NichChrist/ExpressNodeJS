import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { logger } from '../config/logger';
import ShiftLogService from '../service/implementations/ShiftLogService';
const csv = require('csv-parser');
import fs from 'fs';

export default class ShiftLogServiceController {

    private shiftLogService: ShiftLogService;

    constructor() {
        this.shiftLogService = new ShiftLogService();
    }

    shiftLogDetails = async (req: Request, res: Response) => {
        try {
            const data = await this.shiftLogService.getShiftLogById(req.params.id);
            const { code, message } = data.response;
            const shiftLog = data.response.data;
            res.status(data.statusCode).json({
                code: code,
                message: message,
                data: shiftLog,
            });

        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                status: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong',
            });
        }
    };

    listShiftLog = async (req: Request, res: Response) => {
        try {
            const model = await this.shiftLogService.listShiftLog(req.query.name, req.query.filter, req);
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

    openShift = async (req: Request, res: Response) => {
        try {
            const data = await this.shiftLogService.openShift(req.body)
            const { code, message } = data.response;
            const shiftLog = data.response.data;
            res.status(data.statusCode).json({
                code: code,
                message: message,
                data: shiftLog,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                error: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong'
            })
        }
    }

    closeShift = async (req: Request, res: Response) => {
        try {
            const data = await this.shiftLogService.closeShift(req.body, req.params.id)
            const { code, message } = data.response;
            const shiftLog = data.response.data;
            res.status(data.statusCode).json({
                code: code,
                message: message,
                data: shiftLog,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                error: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong'
            })
        }
    }
}

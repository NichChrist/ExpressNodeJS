import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IUom } from '../models/interfaces/IUom';
import { logger } from '../config/logger';
import UomService from '../service/implementations/UomService';
const csv = require('csv-parser');
import fs from 'fs';

export default class UomController {

    private uomService: UomService;

    constructor() {
        this.uomService = new UomService();
    }

    createUom = async (req: Request, res: Response) => {
        try {
            const data = await this.uomService.createUom(req.body, req);
            const { code, message } = data.response;
            const uom = data.response.data;
            res.status(data.statusCode).json({
                code: code,
                message: message,
                data: uom,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                error: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong'
            })
        }
    }

    createBulkUom = async (req: Request, res: Response) => {
        try {
            let uomBody: IUom[] = [];
            if (req.file) {
                const csvFilePath = req.file.path;
                await new Promise<void>((resolve, reject) => {
                    fs.createReadStream(csvFilePath, { encoding: 'utf8' })
                        .pipe(csv())
                        .on('data', (data: IUom) => {
                            uomBody.push(data);
                        })
                        .on('end', () => {
                            fs.unlinkSync(csvFilePath);
                            resolve();
                        })
                        .on('error', (error) => {
                            reject(error);
                        });
                });
            } else {
                uomBody = req.body;
                if (!Array.isArray(req.body)) uomBody = [req.body];
            }
            const user = await this.uomService.createBulkUom(uomBody, req);
            const { code, message, data } = user.response;
            res.status(user.statusCode).json({
                code: code,
                message: message,
                data: data,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    listUom = async (req: Request, res: Response) => {
        try {
            const data = await this.uomService.listUom(req.query.name, req);
            const { code, message } = data.response;
            const uom = data.response.data;
            res.status(data.statusCode).json({
                code: code,
                message: message,
                data: uom,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                error: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong'
            })
        }
    }

    dropdownUom = async (req: Request, res: Response) => {
        try {
            const data = await this.uomService.dropdownUom(req);
            const { code, message } = data.response;
            const uom = data.response.data;
            res.status(data.statusCode).json({
                code: code,
                message: message,
                data: uom,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                error: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong'
            })
        }
    }

    updateUom = async (req: Request, res: Response) => {
        try {
            const data = await this.uomService.updateUomById(req.params.id, req.body, req);
            const { code, message } = data.response;
            const uom = data.response.data;
            res.status(data.statusCode).json({
                code: code,
                message: message,
                data: uom
            })
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                error: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong'
            })
        }
    }

    deleteUom = async (req: Request, res: Response) => {
        try {
            const data = await this.uomService.deleteUomById(req.params.id, req);
            const { code, message } = data.response;
            const uom = data.response.data;
            res.status(data.statusCode).json({
                code: code,
                message: message,
            })
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                error: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong'
            })
        }
    }

    exportToCsv = async (req: Request, res: Response) => {
        try {
            return this.uomService.exportToCSV(res, req);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}
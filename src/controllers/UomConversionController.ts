import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IUomConversion } from '../models/interfaces/IUomConversion';
import { logger } from '../config/logger';
import UomConversionService from '../service/implementations/UomConversionService';
const csv = require('csv-parser');
import fs from 'fs';

export default class UomConversionController {

    private uomConversionService: UomConversionService;

    constructor() {
        this.uomConversionService = new UomConversionService();
    }

    createUomConversion = async (req: Request, res: Response) => {
        try {
            const data = await this.uomConversionService.createUomConversion(req.body);
            const { code, message } = data.response;
            const uomConversion = data.response.data;
            res.status(data.statusCode).json({
                code: code,
                message: message,
                data: uomConversion,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                error: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong'
            })
        }
    }

    createBulkUomConversion = async (req: Request, res: Response) => {
        try {
            let uomConversionBody: IUomConversion[] = [];
            if (req.file) {
                const csvFilePath = req.file.path;
                await new Promise<void>((resolve, reject) => {
                    fs.createReadStream(csvFilePath, { encoding: 'utf8' })
                        .pipe(csv())
                        .on('data', (data: IUomConversion) => {
                            uomConversionBody.push(data);
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
                uomConversionBody = req.body;
                if (!Array.isArray(req.body)) uomConversionBody = [req.body];
            }
            const user = await this.uomConversionService.createFromCsv(uomConversionBody, req);
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

    updateUomConversion = async (req: Request, res: Response) => {
        try {
            const data = await this.uomConversionService.updateUomConversion(req.body);
            const { code, message } = data.response;
            const uomConversion = data.response.data;
            res.status(data.statusCode).json({
                code: code,
                message: message,
                data: uomConversion,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                error: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong'
            })
        }
    }

    deleteUomConversion = async (req: Request, res: Response) => {
        try {
            const data = await this.uomConversionService.deleteUomConversionById(req.params.id, req)
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

    listUomConversion = async (req: Request, res: Response) => {
        try {
            const data = await this.uomConversionService.listUomConversion(req.query.name, req);
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
    

    exportToCsv = async (req: Request, res: Response) => {
        try {
            return this.uomConversionService.exportToCSV(res, req);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}
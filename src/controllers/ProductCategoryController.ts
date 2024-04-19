import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { logger } from '../config/logger';
import ProductCategoryService from '../service/implementations/ProductCategoryService';
import fs from 'fs';
const csv = require('csv-parser');

export default class ProductCategoryController {

    private productCategoryService: ProductCategoryService;

    constructor() {
        this.productCategoryService = new ProductCategoryService();
    }

    getProductCategoriesData = async (req: Request, res: Response) => {
        try {
            const model = await this.productCategoryService.getProductCategoriesData(req);
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

    getProductCategoryDataByName = async (req: Request, res: Response) => {
        try {
            const data = await this.productCategoryService.getProductCategoryByName(req.params.name)
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

    createProductCategory = async (req: Request, res: Response) => {
        try {
            const data = await this.productCategoryService.createProductCategory(req.body.name)
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

    deleteProductCategory = async (req: Request, res: Response) => {
        try {
            const data = await this.productCategoryService.deleteProductCategoryById(req.params.id)
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

    updateProductCategory = async (req: Request, res: Response) => {
        try {
            const data = await this.productCategoryService.updateProductCategoryById(req.params.id, req.body.name);
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

    ExportToCSV = async (req: Request, res: Response) => {
        try {
            return this.productCategoryService.exportToCSV(res);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    createBulkProductCategory = async (req: Request, res: Response) => {
        try {
            let Data: string[] = [];
            if (req.file) {
                const csvFilePath = req.file.path;
                await new Promise<void>((resolve, reject) => {
                    fs.createReadStream(csvFilePath, { encoding: 'utf8' })
                        .pipe(csv())
                        .on('data', (data) => {
                            Data.push(data);
                        })
                        .on('end', () => {
                            fs.unlinkSync(csvFilePath);
                            resolve();
                        })
                        .on('error', (e) => {
                            reject(e);
                        });
                });
            } else {
                Data = req.body;
                if (!Array.isArray(req.body)) Data = [req.body];
            }

            const user = await this.productCategoryService.createBulkProductCategory(Data);
            const { code, message, data } = user.response;
            res.status(user.statusCode).json({
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
    };
}

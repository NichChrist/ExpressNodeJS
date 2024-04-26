import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { logger } from '../config/logger';
import ProductCategoryService from '../service/implementations/ProductCategoryService';
const csv = require('csv-parser');
import fs from 'fs';

export default class ProductCategoryController {

    private productCategoryService: ProductCategoryService;

    constructor() {
        this.productCategoryService = new ProductCategoryService();
    }

    getProductCategories = async (req: Request, res: Response) => {
        try {
            const hasNameQueryParam = req.query.name !== undefined && req.query.name !== '';

            if (!hasNameQueryParam) {
                const model = await this.productCategoryService.getProductCategories(req);
                const { code, message } = model.response;
                const data: any = model.response.data;

                res.status(model.statusCode).json({
                    code: code,
                    message: message,
                    count: data.count,
                    data: data.rows,
                });
            }else{
                const data = await this.productCategoryService.getProductCategoryByName(req.query.name)
                const { code, message } = data.response;
                const role = data.response.data;
                res.status(data.statusCode).json({
                    code: code,
                    message: message,
                    data: role,
                });
            }
            
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                status: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong',
            });
        }
    };

    getProductCategoriesById = async (req: Request, res: Response) => {
        try {
            const data = await this.productCategoryService.getProductById(req.params.id)
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
                status: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong',
            });
        }
    };

    getProductCategoriesByBranch = async (req: Request, res: Response) => {
        try {
            const model = await this.productCategoryService.getProductCategoriesByBranch(req.params.id, req);
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

    createProductCategory = async (req: Request, res: Response) => {
        try {
            const data = await this.productCategoryService.createProductCategory(req.body.name, req)
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

    exportToCsv = async (req: Request, res: Response) => {
        try {
            return this.productCategoryService.exportToCSV(res);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    createMultipleProductCategory = async (req: Request, res: Response) => {
        try {
            let Data: string[] = [];
            if (req.file) {
                const csvFilePath = req.file.path;
                await new Promise<void>((resolve, reject) => {
                    fs.createReadStream(csvFilePath, { encoding: 'utf8' })
                        .pipe(csv())
                        .on('data', (data: string) => {
                            Data.push(data);
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
                Data = req.body;
                if (!Array.isArray(req.body)) Data = [req.body];
            }
            const user = await this.productCategoryService.createBulkProductCategory(Data, req);
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
    };
}

import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IProduct } from '../models/interfaces/IProduct';
import { logger } from '../config/logger';
import ProductService from '../service/implementations/ProductService';
import csv from 'csv-parser';
import fs from 'fs';

export default class ProductController {

    private productService: ProductService;

    constructor() {
        this.productService = new ProductService();
    }

    getProduct = async (req: Request, res: Response) => {
        try {
            const products = await this.productService.getProduct(req.query.order_by, req.query.name, req.query.filter, req);
            const { code, message } = products.response;
            const data: any = products.response.data;
            
            res.status(products.statusCode).json({
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

    getProductById = async (req: Request, res: Response) => {
        try {
            const data = await this.productService.getProductById(req.params.id)
            const { code, message } = data.response;
            const products = data.response.data;
            res.status(data.statusCode).json({
                code: code,
                message: message,
                data: products,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                status: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong',
            });
        }
    };

    dropdownProduct = async (req: Request, res: Response) => {
        try {
            const data = await this.productService.dropdownProduct(req)
            const { code, message } = data.response;
            const products = data.response.data;
            res.status(data.statusCode).json({
                code: code,
                message: message,
                data: products,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    // getProductByBranch = async (req: Request, res: Response) => {
    //     try {
    //         const products = await this.productService.getProductByBranch(req.params.id, req);
    //         const { code, message } = products.response;
    //         const data: any = products.response.data;

    //         res.status(products.statusCode).json({
    //             code: code,
    //             message: message,
    //             count: data.count,
    //             data: data.rows,
    //         });
    //     } catch (e) {
    //         logger.error(e);
    //         res.status(httpStatus.BAD_GATEWAY).json({
    //             status: httpStatus.BAD_GATEWAY,
    //             message: 'Something Went Wrong',
    //         });
    //     }
    // };

    createProduct = async (req: Request, res: Response) => {
        try {
            const data = await this.productService.createProduct(req.body, req)
            const { code, message } = data.response;
            const products = data.response.data;
            res.status(data.statusCode).json({
                code: code,
                message: message,
                data: products,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                error: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong'
            })
        }
    }

    deleteProduct = async (req: Request, res: Response) => {
        try {
            const data = await this.productService.deleteProductById(req.params.id)
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

    updateProduct = async (req: Request, res: Response) => {
        try {
            const data = await this.productService.updateProductById(req.params.id, req.body);
            const { code, message } = data.response;
            const products = data.response.data;
            res.status(data.statusCode).json({
                code: code,
                message: message,
                data: products
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
            return this.productService.exportToCSV(res);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    createMultipleProduct = async (req: Request, res: Response) => {
        try {
            let productBody: IProduct[] = [];
            if (req.file) {
                const csvFilePath = req.file.path;
                await new Promise<void>((resolve, reject) => {
                    fs.createReadStream(csvFilePath, { encoding: 'utf8' })
                        .pipe(csv())
                        .on('data', (data: IProduct) => {
                            productBody.push(data);
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
                productBody = req.body;
                if (!Array.isArray(req.body)) productBody = [req.body];
            }
            const user = await this.productService.createBulkProduct(productBody, req);
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

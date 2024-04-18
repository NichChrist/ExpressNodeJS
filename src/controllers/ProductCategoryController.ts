import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { logger } from '../config/logger';
import ProductCategoryService from '../service/implementations/ProductCategoryService';

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
            const data = await this.productCategoryService.createNewProductCategory(req.body.name)
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
            const user = await this.productCategoryService.exportToCSV(req);
            const { message, data } = user.response;
            const code = user.statusCode;
            res.status(code).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

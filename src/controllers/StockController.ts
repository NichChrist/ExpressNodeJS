import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { logger } from '../config/logger';
import StockService from '../service/implementations/StockService';

export default class OutletController {

    private StockService: StockService;

    constructor() {
        this.StockService = new StockService();
    }

    list = async (req: Request, res: Response) => {
        try {
            const users = await this.StockService.listStock(req.query);
            const { message, data } = users.response;
            const code = users.statusCode;
            res.status(code).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const user = await this.StockService.getStockById(req.params.id);
            const { message, data } = user.response;
            const code = user.statusCode;
            res.status(code).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    deleteStock = async (req: Request, res: Response) => {
        try {
            const data = await this.StockService.deleteStockById(req.params.id)
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
            console.log(req.params.id)
            const data = await this.StockService.updateStockById(req.params.id, req.body);
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
            return this.StockService.exportToCSV(res);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

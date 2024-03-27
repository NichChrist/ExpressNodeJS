import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { logger } from '../config/logger';
import ProvinceService from '../service/implementations/ProvinceService';

export default class OutletController {

    private provinceService: ProvinceService

    constructor() {
        this.provinceService = new ProvinceService();
    }

    list = async (req: Request, res: Response) => {
        try {
            const users = await this.provinceService.listProvince(req.query);
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
            const users = await this.provinceService.dropdownProvince();
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
            const user = await this.provinceService.getProvinceById(req.params.id);
            const { message, data } = user.response;
            const code = user.statusCode;
            res.status(code).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { logger } from '../config/logger';
import CityService from '../service/implementations/CityService';

export default class OutletController {

    private cityService: CityService;

    constructor() {
        this.cityService = new CityService();
    }

    list = async (req: Request, res: Response) => {
        try {
            const users = await this.cityService.listCity(req.query);
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
            const users = await this.cityService.dropdownCity();
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
            const user = await this.cityService.getCityById(req.params.id);
            const { message, data } = user.response;
            const code = user.statusCode;
            res.status(code).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

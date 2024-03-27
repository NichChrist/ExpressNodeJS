import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { logger } from '../config/logger';
import DistrictService from '../service/implementations/DistrictService';

export default class OutletController {

    private districtService: DistrictService;

    constructor() {
        this.districtService = new DistrictService();
    }

    list = async (req: Request, res: Response) => {
        try {
            const users = await this.districtService.listDistrict(req.query);
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
            const users = await this.districtService.dropdownDistrict();
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
            const user = await this.districtService.getDistrictById(req.params.id);
            const { message, data } = user.response;
            const code = user.statusCode;
            res.status(code).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

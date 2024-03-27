/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
import httpStatus from 'http-status';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { logger } from '../../config/logger';
import SubdistrictDao from '../../dao/implementations/SubdistrictDao';
import responseHandler from '../../helper/responseHandler';
import ISubdistirctService from '../contracts/ISubdistrictService';
import { responseMessageConstant } from '../../config/constant';

export default class SubdistirctService implements ISubdistirctService {
    private subdistrictDao : SubdistrictDao


    constructor() {
        this.subdistrictDao = new SubdistrictDao();

    }

    listSubdistrict = async (query) => {
        try {
            const { pagination, page, row } = query;
            let provinceData = await this.subdistrictDao.list(['withoutTimestamp'], pagination, page, row);
            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Fetched All Subdistrict', provinceData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    dropdownSubdistrict = async () => {
        try {
            let provinceData = await this.subdistrictDao.list(['dropdown'], 'false', null!, null!);
            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Fetched All Subdistrict', provinceData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    getSubdistrictById = async (id: string) => {
        try {
            let userData = await this.subdistrictDao.getById(['withoutTimestamp'], id)
            if (!userData) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'Subdistrict Not Found');
            }
            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Fetched A Single Subdistrict', userData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };
}

/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
import httpStatus from 'http-status';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { logger } from '../../config/logger';
import ProvinceDao from '../../dao/implementations/ProvinceDao';
import responseHandler from '../../helper/responseHandler';
import IProvinceService from '../contracts/IProvinceService';
import { responseMessageConstant } from '../../config/constant';

export default class ProvinceService implements IProvinceService {
    private provinceDao: ProvinceDao;

    constructor() {
        this.provinceDao = new ProvinceDao();

    }

    listProvince = async (query) => {
        try {
            const { pagination, page, row } = query;
            let provinceData = await this.provinceDao.list(['withoutTimestamp'], pagination, page, row);
            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Fetched All Provinces', provinceData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    dropdownProvince = async () => {
        try {
            let provinceData = await this.provinceDao.list(['dropdown'], 'false', null!, null!);
            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Fetched All Provinces', provinceData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    getProvinceById = async (id: string) => {
        try {
            let userData = await this.provinceDao.getById(['withoutTimestamp'], id)
            if (!userData) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'Province Not Found');
            }
            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Fetched A Single Province', userData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };
}

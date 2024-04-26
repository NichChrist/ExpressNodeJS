/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
import httpStatus from 'http-status';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { logger } from '../../config/logger';
import CityDao from '../../dao/implementations/CityDao';
import responseHandler from '../../helper/responseHandler';
import ICityService from '../contracts/ICityService';
import { responseMessageConstant } from '../../config/constant';

export default class CityService implements ICityService {
    private cityDao: CityDao;


    constructor() {
        this.cityDao = new CityDao();

    }

    listCity = async (query) => {
        try {
            const { pagination, page, row } = query;
            let cityData = await this.cityDao.list(['withoutTimestamp'], pagination, page, row);
            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Fetched All City', cityData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    dropdownCity = async () => {
        try {
            let cityData = await this.cityDao.list(['dropdown'], 'false', null!, null!);
            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Fetched All City', cityData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    getCityById = async (id: string) => {
        try {
            let data = await this.cityDao.getById(['withoutTimestamp'], id)
            if (!data) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'City Not Found');
            }
            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Fetched A Single City', data);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };
}

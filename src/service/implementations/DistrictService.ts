/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
import httpStatus from 'http-status';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { logger } from '../../config/logger';
import DistrictDao from '../../dao/implementations/DistrictDao';
import responseHandler from '../../helper/responseHandler';
import IDistrictService from '../contracts/IDistrictService';
import { responseMessageConstant } from '../../config/constant';

export default class DistrictService implements IDistrictService {
    private districtDao : DistrictDao


    constructor() {
        this.districtDao = new DistrictDao();

    }

    listDistrict = async (query) => {
        try {
            const { pagination, page, row } = query;
            let provinceData = await this.districtDao.list(['withoutTimestamp'], pagination, page, row);
            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Fetched All District', provinceData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    dropdownDistrict = async () => {
        try {
            let provinceData = await this.districtDao.list(['dropdown'], 'false', null!, null!);
            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Fetched All District', provinceData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    getDistrictById = async (id: string) => {
        try {
            let userData = await this.districtDao.getById(['withoutTimestamp'], id)
            if (!userData) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'District Not Found');
            }
            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Fetched A Single District', userData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };
}

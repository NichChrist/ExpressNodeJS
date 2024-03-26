/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
import httpStatus from 'http-status';
import { v4 as uuid } from 'uuid';
import { Request } from 'express';
import responseHandler from '../../helper/responseHandler';
import OutletDao from '../../dao/implementations/OutletDao';
import IOutletService from '../contracts/IOutletService';
import { IOutlet } from '../../models/interfaces/IOutlet';
import { responseMessageConstant } from '../../config/constant';
import models, { sequelize } from '../../models';

const { outlet: Outlet} = models;

export default class OutletService implements IOutletService {
    private outletDao: OutletDao;

    constructor() {
        this.outletDao = new OutletDao();
    }

    createNewOutlet = async (outletBody: IOutlet) => {
        try {

            if (await this.outletDao.isOutletNameExists(outletBody.name)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, "Outlet Name Taken");
            }
            if (await this.outletDao.isOutletCodeExists(outletBody.code)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, "Outlet Code Taken");
            }

            let outletData = await this.outletDao.create(outletBody);

            if (!outletData) {
                return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
            }

            outletData = outletData.toJSON();
            return responseHandler.returnSuccess(httpStatus.CREATED, responseMessageConstant.OUTLET_201_REGISTERED, outletData);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };

    updateOutletById = async (outletBody: IOutlet, id: string) => {
        try {
            let outletData = await this.outletDao.getById(id)
            if (!outletData) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.OUTLET_404_NOT_FOUND);
            }

            let updatedUserData = await this.outletDao.updateById(outletBody, id);
            if (updatedUserData[0] !== 1) {
                return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
            }

            outletData = await this.outletDao.getById(id)
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.USER_200_UPDATED, outletData);
        } catch (e) {
            console.log(e)
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };

    getOutletsData = async (req: Request) => {
        try {
            const pagination = req.query.pagination;
            let options = {
                attributes: {
                    exclude: ['deleted_at']
                },
            };
            if (pagination == 'true') {
                const row: any = req.query.row;
                const page: any = req.query.page;
                const offset = (page - 1) * row;
                options['offset'] = offset;
                options['limit'] = row;
            }
            const allData = await Outlet.findAndCountAll(options);
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.OUTLET_200_FETCHED_ALL, allData);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    getOutletDataById = async (id: string) => {
        try {
            if (!(await this.outletDao.isOutletExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.OUTLET_404_NOT_FOUND);
            }

            const Outlet = await this.outletDao.findOutlet(id);
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.OUTLET_200_FETCHED_SINGLE, Outlet);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    deleteOutletById = async (id: string) => {
        try {
            if (!(await this.outletDao.isOutletExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.OUTLET_404_NOT_FOUND);
            }

            await this.outletDao.deleteById(id);
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant. OUTLET_200_DELETED);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }
}

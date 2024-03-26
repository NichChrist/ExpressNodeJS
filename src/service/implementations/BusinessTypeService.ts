/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
import httpStatus from 'http-status';
import { Request } from 'express';
import responseHandler from '../../helper/responseHandler';
import IBusinessTypeService from '../contracts/IBusinessTypeService';
import BusinessTypeDao from '../../dao/implementations/BusinessTypeDao';
import models from '../../models';

const { business_type: BusinessType } = models;

export default class BusinessTypeService implements IBusinessTypeService {
    private businessTypeDao: BusinessTypeDao;

    constructor() {
        this.businessTypeDao = new BusinessTypeDao();
    }

    getBusinessTypesData = async (req: Request) => {
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

            const allData = await BusinessType.findAndCountAll(options)
            
            return responseHandler.returnSuccess(httpStatus.OK, 'Business Types retrieved successfully', allData);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something Went Wrong');
        }
    };

    getBusinessTypeById = async (id: string) => {
        try {
            if (!(await this.businessTypeDao.isBusinessTypeExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'Business Type Not Found');
            }

            const BusinessType = await this.businessTypeDao.findBusinessType(id);

            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Fetch A Business Type Data', BusinessType);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something Went Wrong');
        }
    };

    createNewBusinessType = async (name: string) => {
        try {
            if (await this.businessTypeDao.isBusinessTypeNameExists(name)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Business Type with this name already exists');
            }

            let data = await this.businessTypeDao.create({ name: name });
            data = data.toJSON();
            delete data.deleted_at;

            return responseHandler.returnSuccess(httpStatus.CREATED, 'Successfully Create Business Type', data);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something Went Wrong');
        }
    }

    deleteBusinessTypeById = async (id: string) => {
        try {
            if (!(await this.businessTypeDao.isBusinessTypeExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'Business Type Not Found');
            }

            await this.businessTypeDao.deleteById(id);
            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Delete Business Type');
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something Went Wrong');
        }
    }

    updateBusinessTypeById = async (id: string, name: string) => {
        try {
            if (!(await this.businessTypeDao.isBusinessTypeExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'Business Type Not Found');
            }

            let data = await this.businessTypeDao.findBusinessType(id);
            if (name) {
                if (await this.businessTypeDao.isBusinessTypeNameExists(name)) {
                    const BusinessTypeData = await BusinessType.findOne({ where: { name: name } });

                    if (BusinessTypeData.dataValues.id !== id) {
                        return responseHandler.returnError(httpStatus.BAD_REQUEST, 'BusinessType with this name already exists');
                    };
                };

                data = await BusinessType.update(
                    { name: name },
                    { where: { id: id }, returning: true, plain: true }
                );
                data = data[1].dataValues;
                delete data.deleted_at;
            }

            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Update Business Type', data);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something Went Wrong');
        }
    }
}

/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
import httpStatus from 'http-status';
import { Request } from 'express';
import responseHandler from '../../helper/responseHandler';
import IModelService from '../contracts/IModelService';
import ModelDao from '../../dao/implementations/ModelDao';
import models from '../../models';

const { model: Model } = models;

export default class ModelService implements IModelService {
    private modelDao: ModelDao;

    constructor() {
        this.modelDao = new ModelDao();
    }

    getModelsData = async (req: Request) => {
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

            const allData = await Model.findAndCountAll(options)
            
            return responseHandler.returnSuccess(httpStatus.OK, 'Models retrieved successfully', allData);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something Went Wrong');
        }
    };

    getModelById = async (id: string) => {
        try {
            if (!(await this.modelDao.isModelExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'Model Not Found');
            }

            const model = await this.modelDao.findModel(id);

            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Fetch A Model Data', model);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something Went Wrong');
        }
    };

    createNewModel = async (name: string) => {
        try {
            if (await this.modelDao.isModelNameExists(name)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Model with this name already exists');
            }

            let data = await this.modelDao.create({ name: name });
            data = data.toJSON();
            delete data.deleted_at;

            return responseHandler.returnSuccess(httpStatus.CREATED, 'Successfully Create Model', data);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something Went Wrong');
        }
    }

    deleteModelById = async (id: string) => {
        try {
            if (!(await this.modelDao.isModelExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'Model Not Found');
            }
            const model = await Model.findByPk(id);

            model.setActions([]);

            await Model.destroy({ where: { id: id } });
            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Delete Model');
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something Went Wrong');
        }
    }

    updateModelById = async (id: string, name: string) => {
        try {
            if (!(await this.modelDao.isModelExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'Model Not Found');
            }

            let data = await this.modelDao.findModel(id);
            if (name) {
                if (await this.modelDao.isModelNameExists(name)) {
                    const modelData = await Model.findOne({ where: { name: name } });

                    if (modelData.dataValues.id !== id) {
                        return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Model with this name already exists');
                    };
                };

                data = await Model.update(
                    { name: name },
                    { where: { id: id }, returning: true, plain: true }
                );
                data = data[1].dataValues;
                delete data.deleted_at;
            }

            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Update Model', data);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something Went Wrong');
        }
    }
}

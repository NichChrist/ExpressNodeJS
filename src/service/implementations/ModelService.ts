/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
import httpStatus from 'http-status';
import { Request } from 'express';
import responseHandler from '../../helper/responseHandler';
import IModelService from '../contracts/IModelService';
import ModelDao from '../../dao/implementations/ModelDao';
import models from '../../models';
import { responseMessageConstant } from '../../config/constant';

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
            
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.MODEL_200_FETCHED_ALL, allData);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };

    getModelById = async (id: string) => {
        try {
            if (!(await this.modelDao.isModelExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.MODEL_404_NOT_FOUND);
            }

            const model = await this.modelDao.findModel(id);

            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.MODEL_200_FETCHED_SINGLE, model);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
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
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };

    deleteModelById = async (id: string) => {
        try {
            if (!(await this.modelDao.isModelExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.MODEL_404_NOT_FOUND);
            }

            await this.modelDao.deleteById(id);
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.MODEL_200_DELETED);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    updateModelById = async (id: string, name: string) => {
        try {
            if (!(await this.modelDao.isModelExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.MODEL_404_NOT_FOUND);
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

            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.MODEL_200_UPDATED, data);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }
}

/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
import httpStatus from 'http-status';
import { Request } from 'express';
import responseHandler from '../../helper/responseHandler';
import IModuleService from '../contracts/IModuleService';
import ModuleDao from '../../dao/implementations/ModuleDao';
import models from '../../models';

const { module: Module } = models;

export default class ModulesService implements IModuleService {
    private moduleDao: ModuleDao;

    constructor() {
        this.moduleDao = new ModuleDao();
    }

    getModulesData = async (req: Request) => {
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
            const allData = await Module.findAndCountAll(options)
            return responseHandler.returnSuccess(httpStatus.OK, 'Modules retrieved successfully', allData);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something Went Wrong');
        }
    };

    getModulesById = async (id: string) => {
        try {
            if (!(await this.moduleDao.isModuleExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'Module Not Found');
            }

            const module = await this.moduleDao.findModule(id);

            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Fetch A Module Data', module);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something Went Wrong');
        }
    };

    createNewModule = async (name: string) => {
        try {
            if (await this.moduleDao.isModuleNameExists(name)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Module with this name already exists');
            }

            let data = await this.moduleDao.create({ name: name });
            data = data.toJSON();
            delete data.deleted_at;

            return responseHandler.returnSuccess(httpStatus.CREATED, 'Successfully Create Module', data);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something Went Wrong');
        }
    }

    deleteModuleById = async (id: string) => {
        try {
            if (!(await this.moduleDao.isModuleExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'Module Not Found');
            }
            const module = await Module.findByPk(id);

            module.setActions([]);

            await Module.destroy({ where: { id: id } });
            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Delete Module');
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something Went Wrong');
        }
    }

    updateModuleById = async (id: string, name: string) => {
        try {
            if (!(await this.moduleDao.isModuleExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'Module Not Found');
            }

            let data = await this.moduleDao.findModule(id);
            if (name) {
                if (await this.moduleDao.isModuleNameExists(name)) {
                    const moduleData = await Module.findOne({ where: { name: name } });

                    if (moduleData.dataValues.id !== id) {
                        return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Module with this name already exists');
                    };
                };

                data = await Module.update(
                    { name: name },
                    { where: { id: id }, returning: true, plain: true }
                );
                data = data[1].dataValues;
                delete data.deleted_at;
            }

            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Update Module', data);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something Went Wrong');
        }
    }
}

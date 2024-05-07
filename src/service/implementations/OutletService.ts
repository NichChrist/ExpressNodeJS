/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
import httpStatus from 'http-status';
import { Request } from 'express';
import responseHandler from '../../helper/responseHandler';
import OutletDao from '../../dao/implementations/OutletDao';
import BranchDao from '../../dao/implementations/BranchDao';
import IOutletService from '../contracts/IOutletService';
import { IOutlet } from '../../models/interfaces/IOutlet';
import { responseMessageConstant } from '../../config/constant';
import { Op } from 'sequelize';
import models from '../../models';

const { outlet: Outlet} = models;

export default class OutletService implements IOutletService {
    private outletDao: OutletDao;
    private branchDao: BranchDao;
    
    constructor() {
        this.outletDao = new OutletDao();
        this.branchDao = new BranchDao();
    }

    listOutlet = async (query) => {
        try {
            const { pagination, page, row } = query;
            let provinceData = await this.outletDao.list(['withoutTimestamp'], pagination, page, row);
            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Fetched All Outlet', provinceData);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };

    dropdownOutlet = async () => {
        try {
            let outletData = await this.outletDao.list(['dropdown'], 'false', null!, null!);
            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Fetched All Outlet', outletData);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };

    dropdownOutletBranch = async (req: Request) => {
        try {
            const option = {
                where: {
                    [Op.or]: [
                        {id: req.userInfo?.outlet_id},
                        {parent_id: req.userInfo?.outlet_id}
                    ],
                },
                attributes: ['id','name','code']
            };
        
            let outletData = await  Outlet.scope(['withoutTimestamp']).findAll(option);
            
            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Fetched Outlet Branches', outletData);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };

    createNewOutlet = async (req: Request, outletBody: IOutlet) => {
        try {
            outletBody.parent_id= req.userInfo?.outlet_id;
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
    };

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
    };

    getBranchDataByName = async (name: any, req: Request) => {
        try {
            if (!(await this.branchDao.isBranchNameExists(name))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.OUTLET_404_NOT_FOUND);
            }

            const data = await Outlet.findAndCountAll({
                attributes: ['id','parent_id','name'],
                where:{ 
                    name:{
                        [Op.iLike]: `${name}`},
                        [Op.or]: [
                            {id: req.userInfo?.outlet_id},
                            {parent_id: req.userInfo?.outlet_id}
                        ],
                    }
            })

            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.OUTLET_200_FETCHED_ALL, data);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };

    deleteBranchById = async (id: string, req: Request) => {
        try {
            if (!(await this.branchDao.isBranchExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.OUTLET_404_NOT_FOUND);
            }

            const outlets = await Outlet.findAll({
                where: {
                    [Op.or]: [
                        {id: id},
                        {parent_id: id}
                    ],
                }
            });
            for (const outlet of outlets) {
                if (outlet.parent_id === null) {
                    if (outlet.id === req.userInfo?.outlet_id) {
                        return responseHandler.returnError(httpStatus.UNAUTHORIZED, 'This Outlet Is Your Main Branch');
                    }
                } else {
                    if (outlet.parent_id !== req.userInfo?.outlet_id) {
                        return responseHandler.returnError(httpStatus.NOT_FOUND, 'Outlet Is Not Found');
                    }
                }
            }
            await this.branchDao.deleteById(id);
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant. OUTLET_200_DELETED);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    updateBranchById = async (outletBody: IOutlet, id: string, req: Request) => {
        try {
            let outletData = await this.outletDao.getById(id)
            if (!outletData) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.OUTLET_404_NOT_FOUND);
            }

            const outlets = await Outlet.findOne({
                where: {
                    [Op.or]: [
                        {id: req.userInfo?.outlet_id},
                        {parent_id: req.userInfo?.outlet_id}
                    ],
                }
            });
            if (outlets.parent_id === null){
                if (outlets.id !== req.userInfo?.outlet_id){
                    return responseHandler.returnError(httpStatus.NOT_FOUND, 'Outlet Is Not Found');
                }
            }else{
                if (outlets.parent_id !== req.userInfo?.outlet_id){
                    return responseHandler.returnError(httpStatus.NOT_FOUND, 'Outlet Is Not Found');
                }
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
    
}

/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { IUom } from '../../models/interfaces/IUom';
import responseHandler from '../../helper/responseHandler';
import IUomService from '../contracts/IUomService';
import UomDao from '../../dao/implementations/UomDao';
import db, { sequelize } from '../../models';
import { responseMessageConstant } from '../../config/constant';
import * as csv from 'exceljs';
import { Op } from 'sequelize';

const { uom: Uom, outlet_uom: OutletUom } = db;

export default class UomService implements IUomService {
    private uomDao: UomDao;

    constructor() {
        this.uomDao = new UomDao();
    }

    createUom = async (uomBody: IUom, req: Request) => {
        try{
            uomBody.metric_code = uomBody.metric_code?.toLowerCase();

            await sequelize.transaction(async (t) => {
                let data = await Uom.create(uomBody, { transaction: t })
    
                let outletData:any
                outletData = ({
                    outlet_id: req.userInfo?.outlet_id,
                    uom_id: data.id
                })
                
                await OutletUom.create(outletData, { transaction: t })
            })

            return responseHandler.returnSuccess(httpStatus.CREATED, responseMessageConstant.UOM_201_CREATED);
        }catch(e){
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    createBulkUom = async (uomBody: IUom[], req: Request) => {
        try{
            await sequelize.transaction(async (t) => {
                const hasSpace = (str) => /\s/.test(str);
                const codeMap = new Map();
                for (let i = 0; i < uomBody.length; i++) {
                    const metric_code = uomBody[i].metric_code;
                    

                    if (codeMap.has(metric_code)){ 
                        throw { ec: 400, status: httpStatus.NOT_ACCEPTABLE, message: 'Metric Code cannot be duplicates invalid at row: ' + (i+1)}
                    };

                    if (hasSpace(metric_code)){
                        throw { ec: 400, status: httpStatus.NOT_ACCEPTABLE, message: 'Metric Code cannot have space(s) invalid at row: ' + (i+1)}
                    };
                    codeMap.set(metric_code, true);
                }
            });

            for (let i = 0; i < uomBody.length; i++) {
                uomBody[i].metric_code = uomBody[i].metric_code?.toLowerCase();
                const codeCheck = await Uom.findOne({
                    where: {
                        metric_code: uomBody[i].metric_code,
                    },
                    include: [{
                        model: OutletUom,
                        attributes: [],
                        where: {
                            outlet_id : req.userInfo?.outlet_id
                        }
                    }]
                }
            );
            if (codeCheck) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Metric Code Taken invalid at row: ' + (i+1));
            }}

            await sequelize.transaction(async (t) => {
                let data = await Uom.bulkCreate(uomBody, { transaction: t })
    
                let bulkData:Array<any> = [];
                for (let i = 0; i< data.length; i++) {
                    bulkData.push({
                        outlet_id: req.userInfo?.outlet_id,
                        uom_id: data[i].id
                    })
                }
                
                await OutletUom.bulkCreate(bulkData, { transaction: t })
            })

            return responseHandler.returnSuccess(httpStatus.CREATED, responseMessageConstant.UOM_201_CREATED);
        }catch(e:any){
            if (e.ec) return responseHandler.returnError(e.status, e.message);   
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    listUom = async (name: any, req: Request) => {
        try{
            const hasNameQueryParam = req.query.name !== undefined && req.query.name !== '';

            const pagination = req.query.pagination;
            let options = {
                attributes: ['id','name','metric_code','description'],
                include: [{
                    model: OutletUom,
                    attributes: [],
                    where: {
                        outlet_id : req.userInfo?.outlet_id
                    }
                }]
            };

            if (pagination == 'true') {
                const row: any = req.query.row;
                const page: any = req.query.page;
                const offset = (page - 1) * row;
                options['offset'] = offset;
                options['limit'] = row;
            }
            
            if(hasNameQueryParam){
                options['where'] = [{ name:{[Op.iLike]: `${name}`}}];
            }
            let data = await Uom.findAndCountAll(options)

            return responseHandler.returnSuccess(httpStatus.CREATED, responseMessageConstant.UOM_200_FETCHED_ALL, data);
        }catch(e){
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    dropdownUom = async (req: Request) => {
        try {
            let options = {
                include: [{
                    model: OutletUom,
                    attributes: [],
                    where: {
                        outlet_id : req.userInfo?.outlet_id
                    }
                }]
            };
            let districtData = await Uom.scope(['dropdown']).findAll(options);
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.UOM_200_FETCHED_ALL, districtData);
        } catch (e) {
            console.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    updateUomById = async (id: string, uomBody: IUom, req: Request) => {
        try{
            if (!(await this.uomDao.isUomExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.UOM_404_NOT_FOUND)
            }

            const uom = await OutletUom.findOne({
                where: {
                    outlet_id: req.userInfo?.outlet_id,
                    uom_id: id
                }
            });

            if (!uom) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.UOM_404_NOT_FOUND)
            }

            uomBody.metric_code = uomBody.metric_code?.toLowerCase();
            let updateCheck = await this.uomDao.updateById(uomBody, id)
            if (updateCheck[0] !==1) {
                return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY)
            }

            let data = await this.uomDao.findById(id)
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.UOM_200_UPDATED, data)
        }catch(e){
            console.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    deleteUomById = async (id: string, req: Request) => {
        try {
            if (!(await this.uomDao.isUomExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.UOM_404_NOT_FOUND)
            }
            const uom = await OutletUom.findOne({
                where: {
                    outlet_id: req.userInfo?.outlet_id,
                    uom_id: id
                }
            });
            if (!uom) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.UOM_404_NOT_FOUND)
            }
            await sequelize.transaction(async (t) => {
                await Uom.destroy({ where: { id } }, { transaction: t })
                await OutletUom.destroy({ where: { uom_id : id } }, { transaction: t })
            })
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.UOM_200_DELETED)
        }catch(e){
            console.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    exportToCSV = async (res: Response, req: Request) => {
        try {
            const workbook = new csv.Workbook();
            const worksheet = workbook.addWorksheet('Uom List');

            let options = {
                attributes: ['id','name','metric_code','description'],
                include: [{
                    model: OutletUom,
                    attributes: [],
                    where: {
                        outlet_id : req.userInfo?.outlet_id
                    }
                }]
            };
            const { rows: allData } = await Uom.findAndCountAll(options);
            const productColumns = [
                { key: 'id', header: 'ID'},
                { key: 'name', header: 'Name'},
                { key: 'metric_code', header: 'Metric Code'},
            ];
            worksheet.columns = productColumns;

            allData.forEach((rowData) => {
            worksheet.addRow(rowData);
            });

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            );
            res.setHeader(
                'Content-Disposition',
                `attachment; filename=placeholder.csv`,
            );
        
            return workbook.csv.write(res).then(() => {
                res.status(200).end();
            });
            
      } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, "Export Failed")
      }
    }
}
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import responseHandler from '../../helper/responseHandler';
import IUomConversionService from '../contracts/IUomConversionService';
import { responseMessageConstant } from '../../config/constant';
import { IUomConversion } from '../../models/interfaces/IUomConversion';
import db, { sequelize } from '../../models';
import * as csv from 'exceljs';
import { Op } from 'sequelize';

const { uom_conversion: UomConversion, uom: Uom, outlet_uom: OutletUom } = db;

export default class UomConversionService implements IUomConversionService {

    createUomConversion = async (uomBody: IUomConversion[]) => {
        try{
            await sequelize.transaction(async (t) => {
                await UomConversion.bulkCreate(uomBody, { transaction: t })
            })

            return responseHandler.returnSuccess(httpStatus.CREATED, responseMessageConstant.UOM_CONVERSION_201_BULK_CREATED)
        }catch(e){
            console.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    updateUomConversion = async (uomBody: IUomConversion[]) => {
        try{
            await sequelize.transaction(async (t) => {
                await UomConversion.truncate({ force: true }, { transaction: t });
                await UomConversion.bulkCreate(uomBody, { transaction: t })
            })

            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.UOM_CONVERSION_200_BULK_UPDATED)
        }catch(e){
            console.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    deleteUomConversionById = async (id: string, req: Request) => {
        try{
            let data = await UomConversion.findByPk(id)
            if (!data) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.UOM_CONVERSION_404_NOT_FOUND)
            }

            const outletFromCheck = await OutletUom.findOne({
                where: {
                    outlet_id: req.userInfo?.outlet_id,
                    uom_id: data.uom_from_id
                }
            });
            const outletToCheck = await OutletUom.findOne({
                where: {
                    outlet_id: req.userInfo?.outlet_id,
                    uom_id: data.uom_to_id
                }
            });
            if (!outletFromCheck) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.UOM_CONVERSION_404_NOT_FOUND);
            }
            if (!outletToCheck) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.UOM_CONVERSION_404_NOT_FOUND);
            }
            
            await UomConversion.destroy({where: { id },force: true});

            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.UOM_CONVERSION_200_DELETED)
        }catch(e){
            console.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    createFromCsv = async (uomBody: IUomConversion[], req: Request) => {
        try{

            for (let i = 0; i < uomBody.length; i++) {
                const uomFromCheck = await Uom.findByPk(uomBody[i].uom_from_id)
                    if(!uomFromCheck){
                        return responseHandler.returnError(httpStatus.NOT_FOUND, 'Uom From Id row ' + (i+1) + ' Not Found');
                    }

                const uomToCheck = await Uom.findByPk(uomBody[i].uom_to_id)
                    if(!uomToCheck){
                        return responseHandler.returnError(httpStatus.NOT_FOUND, 'Uom To Id row ' + (i+1) + ' Not Found');
                    }

                if (uomBody[i].uom_from_id === uomBody[i].uom_to_id) {
                    return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Uom From Id and Uom To Id in row ' + (i+1) + ' cannot be the same');
                }
            }

            for (let i = 0; i < uomBody.length; i++) {
                const outletFromCheck = await OutletUom.findOne({
                    where: {
                        outlet_id : req.userInfo?.outlet_id,
                        uom_id : uomBody[i].uom_from_id
                    }
                })

                if (!outletFromCheck) {
                    return responseHandler.returnError(httpStatus.NOT_FOUND, 'Uom From Id row ' + (i+1) + ' Not Found');
                }

                const outletToCheck = await OutletUom.findOne({
                    where: {
                        outlet_id : req.userInfo?.outlet_id,
                        uom_id : uomBody[i].uom_to_id
                    }
                })
                if (!outletToCheck) {
                    return responseHandler.returnError(httpStatus.NOT_FOUND, 'Uom To Id row ' + (i+1) + ' Not Found');
                }
            }

            await sequelize.transaction(async (t) => {
                await UomConversion.bulkCreate(uomBody, { transaction: t })
            })

            return responseHandler.returnSuccess(httpStatus.CREATED, responseMessageConstant.UOM_CONVERSION_201_BULK_CREATED)
        }catch(e){
            console.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }
    
    listUomConversion = async (name: any, req: Request) => {
        try{
            const hasNameQueryParam = req.query.name !== undefined && req.query.name !== '';

            const pagination = req.query.pagination;

            let options_1:any = {
                attributes: [
                    'id',
                    'uom_from_id',
                    [sequelize.literal('"uom_from"."name"'), 'uoms_from_name'],
                    'uom_to_id',
                    [sequelize.literal('"uom_to"."name"'), 'uoms_to_name'],
                    'multiplier'
                ],
                include: [{
                    model: Uom,
                    as: 'uom_from',
                    where: {},
                    attributes: [],
                    include: [{
                        model: OutletUom,
                        attributes: [],
                        where:{
                            outlet_id: req.userInfo?.outlet_id
                        }
                    }],
                },{
                    model: Uom,
                    as: 'uom_to',
                    where: {},
                    attributes: [],
                    include: [{
                        model: OutletUom,
                        attributes: [],
                        where:{
                            outlet_id: req.userInfo?.outlet_id
                        }
                    }],
                }],   
            };

            let options_2:any = {
                attributes: [
                    'id',
                    'uom_from_id',
                    [sequelize.literal('"uom_from"."name"'), 'uoms_from_name'],
                    'uom_to_id',
                    [sequelize.literal('"uom_to"."name"'), 'uoms_to_name'],
                    'multiplier'
                ],
                include: [{
                    model: Uom,
                    as: 'uom_from',
                    where: {},
                    attributes: [],
                    include: [{
                        model: OutletUom,
                        attributes: [],
                        where:{
                            outlet_id: req.userInfo?.outlet_id
                        }
                    }],
                },{
                    model: Uom,
                    as: 'uom_to',
                    where: {},
                    attributes: [],
                    include: [{
                        model: OutletUom,
                        attributes: [],
                        where:{
                            outlet_id: req.userInfo?.outlet_id
                        }
                    }],
                }],   
            };

            if (pagination == 'true') {
                const row: any = req.query.row;
                const page: any = req.query.page;
                const offset = (page - 1) * row;
                options_1['offset'] = offset;
                options_1['limit'] = row;
                options_2['offset'] = offset;
                options_2['limit'] = row;
            }

            if (hasNameQueryParam) {
                Object.assign(options_1.include[0].where, {
                    name: { [Op.iLike]: `%${name}%` } ,  
                });
                Object.assign(options_2.include[1].where, {
                    name: { [Op.iLike]: `%${name}%` } ,  
                });
                const data_1 = await UomConversion.findAndCountAll(options_1)
                const data_2 = await UomConversion.findAndCountAll(options_2)

                const mergedRows = data_1.rows.concat(data_2.rows);
                const mergedCount = data_1.count + data_2.count;

                const mergedData = { count: mergedCount, rows: mergedRows };
                return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.UOM_CONVERSION_200_FETCHED_ALL, mergedData)
            }

   
            let data = await UomConversion.findAndCountAll(options_1)
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.UOM_CONVERSION_200_FETCHED_ALL, data)
        }catch(e){
            console.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    exportToCSV = async (res: Response, req: Request) => {
        try {
            const workbook = new csv.Workbook();
            const worksheet = workbook.addWorksheet('Uom Conversion List');

            let options:any = {
                attributes: [
                    'id',
                    'uom_from_id',
                    [sequelize.literal('"uom_from"."name"'), 'uoms_from_name'],
                    'uom_to_id',
                    [sequelize.literal('"uom_to"."name"'), 'uoms_to_name'],
                    'multiplier'
                ],
                include: [{
                    model: Uom,
                    as: 'uom_from',
                    where: {},
                    attributes: [],
                    include: [{
                        model: OutletUom,
                        attributes: [],
                        where:{
                            outlet_id: req.userInfo?.outlet_id
                        }
                    }],
                },{
                    model: Uom,
                    as: 'uom_to',
                    where: {},
                    attributes: [],
                    include: [{
                        model: OutletUom,
                        attributes: [],
                        where:{
                            outlet_id: req.userInfo?.outlet_id
                        }
                    }],
                }],   
            };
            const { rows: allData } = await UomConversion.findAndCountAll(options);
            const productColumns = [
                { key: 'id', header: 'ID'},
                { key: 'uoms_from_name', header: 'Uom From Name'},
                { key: 'uoms_to_name', header: 'Uom to Name'},
                { key: 'multiplier', header: 'Multiplier'},
            ];
            worksheet.columns = productColumns;

            allData.forEach((rowData) => {
            worksheet.addRow(rowData.toJSON());
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

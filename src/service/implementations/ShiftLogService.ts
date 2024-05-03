/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import responseHandler from '../../helper/responseHandler';
import IShiftLogService from '../contracts/IShiftLogService';
import db, { Sequelize, sequelize }  from '../../models';
import { responseMessageConstant } from '../../config/constant';
import { IShiftLog } from '../../models/interfaces/IShiftLog';
import { Op } from 'sequelize';
import { initial } from 'lodash';

const { shift_log: ShiftLog, cashless_shift_log: CashlessShiftLog, user: User, outlet: Outlet } = db;

export default class ShiftLogService implements IShiftLogService {
    openShift = async (shiftBody: IShiftLog) => {
        try{
            shiftBody.status = "open";
            shiftBody.start_time = sequelize.literal('CURRENT_TIMESTAMP')
            let data = await ShiftLog.create(shiftBody)
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.SHIFTLOG_201_CREATED, data)
        }catch(e){
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY)
        }
    };


    closeShift = async (shiftBody: IShiftLog, id: string) => {
        try{
            let shiftData:any
            await sequelize.transaction(async (t) => {
                if (!(await ShiftLog.findByPk(id))) {
                    return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.SHIFTLOG_404_NOT_FOUND);
                }
                
                shiftBody.status = "close";
                shiftBody.end_time = sequelize.literal('CURRENT_TIMESTAMP');

                let updatedCheck = await ShiftLog.update(shiftBody, {
                    where: { id },
                    transaction: t
                });
                if (!updatedCheck[0]) {
                    return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
                }
                
                let data = await ShiftLog.findOne({ where: { id }, transaction: t });
                for (let i = 0; i < shiftBody.cashless_shift_log.length; i++) {
                    await CashlessShiftLog.create({
                        shift_log_id: data.id,
                        cashless_type: shiftBody.cashless_shift_log[i].cashless_type,
                        price: shiftBody.cashless_shift_log[i].price
                    }, { 
                        transaction: t 
                    });
                }
                shiftData = data.toJSON();
            });            
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.SHIFTLOG_201_CREATED, shiftData)
        }catch(e){
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY)
        }
    };

    listShiftLog = async (name: any, filter: any, req: Request) => {
        try{
            const hasNameQueryParam = req.query.name !== undefined && req.query.name !== '';
            const hasFilterQueryParam = req.query.filter !== undefined && req.query.filter !== '';

            const pagination = req.query.pagination;
            let options:any = {
                attributes: ['id',
                [sequelize.literal('"user"."username"'), 'cashier_name'],
                'start_time',
                'end_time'
            ],
                include: [{
                    model: User,
                    where: {

                    },
                    attributes: []
                }],
            };

            if (hasNameQueryParam) {
                Object.assign(options.include[0].where, {
                    name: {[Op.iLike]: `${name}`}
                });
            }
            
            if (hasFilterQueryParam) {
                Object.assign(options.include[0].where, {
                    outlet_id: filter
                });
            }

            if (pagination == 'true') {
                const row: any = req.query.row;
                const page: any = req.query.page;
                const offset = (page - 1) * row;
                options['offset'] = offset;
                options['limit'] = row;
            }
    
            let data = await ShiftLog.findAndCountAll(options);
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.SHIFTLOG_200_FETCHED_ALL, data)
        }catch(e){
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY)
        }
    };

    getShiftLogById = async (id: string) => {
        try{
            if (!(await ShiftLog.findByPk(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.SHIFTLOG_404_NOT_FOUND);
            }
            let options = {
                where: { id:id },
                attributes: {
                    include: [
                        'id'
                    ], 
                },
                include: [{
                    model: CashlessShiftLog,
                    where: {
                        shift_log_id : id
                    },
                }]
                
            };
    
            let data = await ShiftLog.findOne(options);
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.SHIFTLOG_201_CREATED, data)
        }catch(e){
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY)
        }
    };
}
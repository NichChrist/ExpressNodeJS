/* eslint-disable class-methods-use-this */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi from 'joi';
import ApiError from '../helper/ApiError';
import responseHandler from '../helper/responseHandler';
import models from '../models';
import { responseMessageConstant } from '../config/constant';
import { Op } from 'sequelize';
import CashlessShiftLog from '../models/CashlessShiftLog';

const { shift_log: ShiftLog, user: User, outlet: Outlet } = models;

export default class ProductValidator {

    async openShiftValidator(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            user_id: Joi.string().guid().required().messages({
                "string.guid": '"User Id" must be in a valid UUID format',
                "string.empty": '"User Id" is not allowed to be empty'
            }),
            cashier_code: Joi.string().required().messages({
                "string.empty": '"Cashier Code" is not allowed to be empty'
            }),
            initial_balance: Joi.number().required().messages({
                "number.empty": '"Initial Balance" is not allowed to be empty',
                "array.number": '"Price" must be a number',
            }),
        });

        // schema options
        const options = {
            abortEarly: false, // include all errors
            allowUnknown: true, // ignore unknown props
            stripUnknown: true, // remove unknown props
        };

        // validate request body against schema
        const { error, value } = schema.validate(req.body, options);

        if (error) {
            // on fail return comma separated errors
            const errorMessage = error.details
                .map((details) => {
                    return details.message;
                })
                .join(', ');
            return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, errorMessage));
        } else {

            const user = await User.findOne({
                where: {
                    id: value.user_id
                }
            });
            if(!user){
                return next(new ApiError (httpStatus.NOT_FOUND, responseMessageConstant.USER_404_NOT_FOUND));
            }

            if (user.outlet_id!== req.userInfo?.outlet_id){
                return next(new ApiError(httpStatus.UNAUTHORIZED, 'You Do Not Work In This Outlet'));
            }

            req.body = value;
            return next();
        }
    }

    async closeShiftValidator(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            total_sales: Joi.number().required().messages({
                "number.empty": '"Initial Balance" is not allowed to be empty',
                "array.number": '"Price" must be a number',
            }),
            cash: Joi.number().required().messages({
                "number.empty": '"Initial Balance" is not allowed to be empty',
                "array.number": '"Price" must be a number',
            }),
            cashless_shift_log: Joi.array().items(Joi.object({
                cashless_type: Joi.string().required().messages({
                    "array.empty": '"Cashless Type" is not allowed to be empty',
                }),
                price: Joi.number().required().messages({
                    "array.empty": '"Price" is not allowed to be empty',
                    "array.number": '"Price" must be a number',
                }), 
            })).required().messages({
                "array.empty": '"Cashless Shift Log" is not allowed to be empty',
            })
        });

        // schema options
        const options = {
            abortEarly: false, // include all errors
            allowUnknown: true, // ignore unknown props
            stripUnknown: true, // remove unknown props
        };

        // validate request body against schema
        const { error, value } = schema.validate(req.body, options);

        if (error) {
            // on fail return comma separated errors
            const errorMessage = error.details
                .map((details) => {
                    return details.message;
                })
                .join(', ');
            return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, errorMessage));
        } else {
            let borrow = await ShiftLog.findOne({ where: { id : req.params.id }});

            value.user_id = borrow.user_id;
            value.cashier_code = borrow.cashier_code;
            value.initial_balance = borrow.initial_balance;
            value.start_time = borrow.start_time;


            const user = await User.findOne({
                where: {
                    id: value.user_id
                }
            });
            if(!user){
                return next(new ApiError (httpStatus.NOT_FOUND, responseMessageConstant.USER_404_NOT_FOUND));
            }

            if (user.outlet_id!== req.userInfo?.outlet_id){
                return next(new ApiError(httpStatus.UNAUTHORIZED, 'You Do Not Work In This Outlet'));
            }



            req.body = value;
            return next();
        }
    }

    async shiftLogListValidator(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            name: Joi.string().allow(null, ''),
            filter: Joi.string().guid().allow(null, '').messages({
                "string.guid": '"Outlet Id" must be in a valid UUID format',
            }),
        });

        const options = {
            abortEarly: false, // include all errors
            allowUnknown: true, // ignore unknown props
            stripUnknown: true, // remove unknown props
        };

        // validate request body against schema
        const { error, value } = schema.validate(req.query, options);

        if (error) {
            // on fail return comma separated errors
            const errorMessage = error.details
                .map((details) => {
                    return details.message;
                })
                .join(', ');
            return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, errorMessage));
        } else {
            try {   
                //name
                //if value.name not null check does it exist
                const count = await User.count({
                    where: {
                        name: {
                            [Op.iLike]: `${value.name}`
                        }
                    }
                });
                if (!count) {
                    return next(new ApiError(httpStatus.NOT_FOUND,responseMessageConstant.NAME_404_NOT_FOUND));
                }

                //filter
                if (!['', null].includes(value.filter)) {
                    const outlets = await Outlet.findOne({
                        where: {
                            id: value.filter,
                        }
                    });

                    if(!outlets){
                        return next(new ApiError (httpStatus.NOT_FOUND, responseMessageConstant.OUTLET_404_NOT_FOUND));
                    }

                    if (outlets.parent_id === null){
                        if (outlets.id !== req.userInfo?.outlet_id){
                            return next(new ApiError(httpStatus.UNAUTHORIZED, 'This Outlet Is Not Your Branch'));
                        }
                    }else{
                        if (outlets.parent_id !== req.userInfo?.outlet_id){
                            return next(new ApiError(httpStatus.UNAUTHORIZED, 'This Outlet Is Not Your Branch'));
                        }
                    }
                }

                req.body = value;
                return next();
            } catch (e) {
                console.log(e);
                return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
            }
        }
    }
}


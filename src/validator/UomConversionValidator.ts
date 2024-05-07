/* eslint-disable class-methods-use-this */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi from 'joi';
import ApiError from '../helper/ApiError';
import responseHandler from '../helper/responseHandler';
import db from '../models';
import { Op } from 'sequelize';
import { responseMessageConstant } from '../config/constant';

const { uom_conversion: UomConversion, uom: Uom, outlet_uom: OutletUom } = db;

export default class IngredientValidator {

    async uomConversionCreateValidator(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.array().items(
            Joi.object({
                uom_from_id: Joi.string().guid().required().messages({
                    "string.empty": '"Uoms From Id" is not allowed to be empty',
                    "array.includes": 'Each item in "Uoms From Id" must be a valid UUID format'
                }),
                uom_to_id: Joi.string().guid().required().messages({
                    "string.empty": '"Uoms To Id" is not allowed to be empty',
                    "array.includes": 'Each item in "Uoms To Id" must be a valid UUID format'
                }),
                multiplier: Joi.number().required().messages({
                    "string.empty": '"Multiplier" is not allowed to be empty',
                    "array.number": '"Multiplier" must be a number',
                }),
            })
        );

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
            try {

                for (let i = 0; i < value.length; i++) {
                    const uomFromCheck = await Uom.findByPk(value[i].uom_from_id)
                        if(!uomFromCheck){
                            return next(new ApiError(httpStatus.NOT_FOUND, 'Uom From Id row ' + (i+1) + ' Not Found'));
                        }

                    const uomToCheck = await Uom.findByPk(value[i].uom_to_id)
                        if(!uomToCheck){
                            return next(new ApiError(httpStatus.NOT_FOUND, 'Uom To Id row ' + (i+1) + ' Not Found'));
                        }

                    if (value[i].uom_from_id === value[i].uom_to_id) {
                        return next(new ApiError(httpStatus.BAD_REQUEST, 'Uom From Id and Uom To Id in row ' + (i+1) + ' cannot be the same'));
                    }
                }

                for (let i = 0; i < value.length; i++){
                    const outletFromCheck = await OutletUom.findOne({
                            where: {
                                outlet_id : req.userInfo?.outlet_id,
                                uom_id : value[i].uom_from_id
                            }
                        })

                    if (!outletFromCheck) {
                        return next(new ApiError(httpStatus.NOT_FOUND, 'Uom From Id row ' + (i+1) + ' Not Found'));
                    }

                    const outletToCheck = await OutletUom.findOne({
                        where: {
                            outlet_id : req.userInfo?.outlet_id,
                            uom_id : value[i].uom_to_id
                        }
                    })
                    if (!outletToCheck) {
                        return next(new ApiError(httpStatus.NOT_FOUND, 'Uom To Id row ' + (i+1) + ' Not Found'));
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

    async uomConversionUpdateValidator(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.array().items(
            Joi.object({
                uom_from_id: Joi.string().guid().required().messages({
                    "string.empty": '"Uoms From Id" is not allowed to be empty',
                    "array.includes": 'Each item in "Uoms From Id" must be a valid UUID format'
                }),
                uom_to_id: Joi.string().guid().required().messages({
                    "string.empty": '"Uoms To Id" is not allowed to be empty',
                    "array.includes": 'Each item in "Uoms To Id" must be a valid UUID format'
                }),
                multiplier: Joi.number().required().messages({
                    "string.empty": '"Multiplier" is not allowed to be empty',
                    "array.number": '"Multiplier" must be a number',
                }),
            })
        );

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
            try {

                for (let i = 0; i < value.length; i++) {
                    const uomFromCheck = await Uom.findByPk(value[i].uom_from_id)
                        if(!uomFromCheck){
                            return next(new ApiError(httpStatus.NOT_FOUND, 'Uom From Id row ' + (i+1) + ' Not Found'));
                        }

                    const uomToCheck = await Uom.findByPk(value[i].uom_to_id)
                        if(!uomToCheck){
                            return next(new ApiError(httpStatus.NOT_FOUND, 'Uom To Id row ' + (i+1) + ' Not Found'));
                        }

                    if (value[i].uom_from_id === value[i].uom_to_id) {
                        return next(new ApiError(httpStatus.BAD_REQUEST, 'Uom From Id and Uom To Id in row ' + (i+1) + ' cannot be the same'));
                    }
                }

                for (let i = 0; i < value.length; i++){
                    const outletFromCheck = await OutletUom.findOne({
                            where: {
                                outlet_id : req.userInfo?.outlet_id,
                                uom_id : value[i].uom_from_id
                            }
                        })
                    if (!outletFromCheck) {
                        return next(new ApiError(httpStatus.NOT_FOUND, 'Uom From Id row ' + (i+1) + ' Not Yours'));
                    }

                    const outletToCheck = await OutletUom.findOne({
                        where: {
                            outlet_id : req.userInfo?.outlet_id,
                            uom_id : value[i].uom_to_id
                        }
                    })
                    if (!outletToCheck) {
                        return next(new ApiError(httpStatus.NOT_FOUND, 'Uom To Id row ' + (i+1) + ' Not Yours'));
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

    async uomConversionGetValidator(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            name: Joi.string().allow(null, ''),
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
                if (!['', null].includes(value.name)) {
                    await Uom.count({
                        where:{ 
                            name: { [Op.iLike]: `%${value.name}%`} 
                        },}).then((count) =>{
                            if (count === 0){
                                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.UOM_404_NOT_FOUND);
                            }   
                        }
                    ); 
                }
                
                req.body = value;
                return next();
            } catch (e) {
                console.log(e);
                return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
            }
        }
    }

    async csvValidator(req: Request, res: Response, next: NextFunction) {
        if (!req.file) {
            return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'csv is required'));
        } else return next();
    }

}


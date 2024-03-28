/* eslint-disable class-methods-use-this */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi from 'joi';
import ApiError from '../helper/ApiError';
import { responseMessageConstant } from '../config/constant';
import responseHandler from '../helper/responseHandler';
import models from '../models';
import { Op } from 'sequelize';

const {outlet: Outlet, subdistrict: Subdistrict, business_type: BusinessType} = models;

export default class OutletValidator {

    async OutletCreateValidator(req: Request, res: Response, next: NextFunction) {
        // create schema object
        const schema = Joi.object({ 
            business_type_id: Joi.string().guid().required().messages({
                "string.guid": '"business_type_id" must be in a valid UUID format',
                "string.empty": '"business_type_id" is not allowed to be empty',
            }),
            name: Joi.string().required().messages({
                "string.empty": responseMessageConstant.NAME_422_EMPTY,
            }),
            code: Joi.string().pattern(/^\S*$/).required().messages({
                "string.empty": '"Code" is not allowed to be empty',
                "string.pattern.base": '"Code" must be in a valid code format (No Spaces)'
            }),
            phone: Joi.string().pattern(/^\S*$/).required().messages({
                "string.empty": responseMessageConstant.PHONENUMBER_422_EMPTY,
                "string.pattern.base": responseMessageConstant.PHONENUMBER_422_INVALID_FORMAT
            }),
            subdistrict_id: Joi.string().guid().allow(null, '').messages({
                "string.guid": '"subdistrict_id" must be in a valid UUID format',
            }),
            description: Joi.string().allow(null, ''),
            address: Joi.string().allow(null, ''),
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
            try {
                //bussinessType
                //Check does the bussinessType exist or not    
                const businessType = await BusinessType.findByPk(value.business_type_id);
                //if it doesn't exist kaboom throw error
                if (!businessType) {
                    return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Business Type Not Found'));
                }

                //subdistrict_id
                //If the value.subdistrict_id not null 
                if (!['', null].includes(value.subdistrict_id)) {
                    //Check does the bussinessType exist or not  
                    const subdistrict = await Subdistrict.findByPk(value.subdistrict_id);
                    //if it doesn't exist kaboom throw error
                    if(!subdistrict) {
                        return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Subdistrict Not Found'));
                    }
                // else the value.subdistrict_id null
                } else {
                    //just empty it
                    value.subdistrict_id = null;
                }

                //code
                //UpperCase the value.code
                value.code = value.code.toUpperCase();
                //Find value.code in DB that is not self
                const outletCode = await Outlet.findOne({
                    where: {
                        code: value.code
                    }
                });
                //if the const is true throw error
                if (outletCode){
                    return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Outlet Code is Taken')); 
                }

                value.parent_id = req.userInfo?.outlet_id

                req.body = value;
                return next();
            } catch (e) {
                console.log(e);
                return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
            }
        }
    }

    async outletUpdateValidator(req: Request, res: Response, next: NextFunction) {
        // create schema object
        const schema = Joi.object({
            business_type_id: Joi.string().guid().allow(null, '').messages({
                "string.guid": '"business_type_id" must be in a valid UUID format',
            }),
            name: Joi.string().allow(null, ''),
            code: Joi.string().pattern(/^\S*$/).allow(null, '').messages({
                "string.pattern.base": '"Code" must be in a valid code format (No Spaces)'
            }),
            phone: Joi.string().pattern(/^\S*$/).allow(null, '').messages({
                "string.pattern.base": responseMessageConstant.PHONENUMBER_422_INVALID_FORMAT
            }),
            subdistrict_id: Joi.string().guid().allow(null, '').messages({
                "string.guid": '"subdistrict_id" must be in a valid UUID format',
            }),
            description: Joi.string().allow(null, ''),
            address: Joi.string().allow(null, ''),
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
            try {
                console.log(value,"Value Before")
                //Call the data row of with the same 'id' from 'req.params.id'
                //'req.params.id' is from the ApiDog path params
                const outletData = await Outlet.findOne({
                    where: {
                        id: req.params.id,
                    }
                });

                //business_type_id
                //if value.business_type_id not null check does it exist
                if (!['', null].includes(value.business_type_id)) {
                    const businessType = await BusinessType.findByPk(value.business_type_id);
                if (businessType === null) {
                    return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Business Type Not Found'));
                }
                }
                //if null fill it with it own data from the DB row
                if (['', null].includes(value.business_type_id)) {
                    value.business_type_id = outletData.business_type_id
                }

                //name
                //if name is null then fill it with the name of the row that is already in the DB
                if (['', null].includes(value.name)) {
                    value.name = outletData.name
                }

                //code
                //UpperCase the value.code
                value.code = value.code.toUpperCase();
                //Find value.code in DB that is not self
                const outletCode = await Outlet.findOne({
                    where: {
                        id: {
                            [Op.ne]: req.params.id
                        },
                        code: value.code
                    }
                });
                //if the const is true throw error
                if (outletCode){
                    return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Outlet Code is Taken')); 
                }
                //if code is null then fill it with the code of the row that is already in the DB
                if (['', null].includes(value.code)) {
                    value.code = outletData.code
                }

                //phone
                //if phone is null then fill it with the code of the row that is already in the DB
                if (['', null].includes(value.phone)) {
                    const outletData = await Outlet.findOne({
                        attributes: ['phone'],
                        where: {
                            id: req.params.id,
                        }
                    });
                    value.phone = outletData.phone
                }

                //subdistrict_id
                //if value.subdistrict_id not null check does it exist
                if (!['', null].includes(value.subdistrict_id)) {
                    const subdistrict = await Subdistrict.findByPk(value.subdistrict_id);
                    //throw error if it doesn't exist
                    if(!subdistrict) {
                        return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Subdistrict Not Found'));
                    }
                } 
                //if null fill it with it own data from the DB row
                if (['', null].includes(value.subdistrict_id)) {
                    value.subdistrict_id = outletData.subdistrict_id
                }

                //description
                //if null fill it with it own data fromt the DB row
                if (['',null].includes(value.description)){
                    value.description = outletData.description
                }
                
                //address
                //if null fill it with it own data fromt the DB row
                if (['',null].includes(value.address)){
                    value.address = outletData.address
                }
                
                //parent_id
                value.parent_id = outletData.parent_id

                console.log(value,"Value After")
                req.body = value;
                return next();
            } catch (e) {
                console.log(e);
                return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
            }
        }
    }

}



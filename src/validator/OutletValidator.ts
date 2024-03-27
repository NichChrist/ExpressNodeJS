/* eslint-disable class-methods-use-this */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi from 'joi';
import ApiError from '../helper/ApiError';
import { responseMessageConstant } from '../config/constant';
import responseHandler from '../helper/responseHandler';
import models from '../models';

const {subdistrict: Subdistrict, business_type: BusinessType} = models;

export default class OutletValidator {

    async OutletCreateValidator(req: Request, res: Response, next: NextFunction) {
        // create schema object
        const schema = Joi.object({ 
            business_type_id: Joi.string().guid().required().messages({
                "string.guid": '"business_type_id" must be in a valid UUID format',
            }),
            name: Joi.string().required().messages({
                "string.empty": responseMessageConstant.NAME_422_EMPTY,
            }),
            code: Joi.string().required().messages({
                "string.empty": '"Code" is not allowed to be empty',
                "string.pattern.base": '"Code" must be in a valid phone number format (No Spaces)'
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
                if (!['', null].includes(value.subdistrict_id)) {

                    const subdistrict = await Subdistrict.findByPk(value.subdistrict_id);
                    
                    if(!subdistrict) {
                        return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Subdistrict Not Found'));
                    }
                    
                } else {
                    value.subdistrict_id = null;
                }
                    
                const businessType = await BusinessType.findByPk(value.business_type_id);
                if (businessType === null) {
                    return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Business Type Not Found'));
                }
                
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
            business_type_id: Joi.string().guid().required().messages({
                "string.guid": '"business_type_id" must be in a valid UUID format',
            }),
            name: Joi.string().required().messages({
                "string.empty": responseMessageConstant.NAME_422_EMPTY,
            }),
            code: Joi.string().required().messages({
                "string.empty": '"Code" is not allowed to be empty',
                "string.pattern.base": '"Code" must be in a valid phone number format (No Spaces)'
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
        const { error, value } = schema.validate(req.params, options);

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
                if (!['', null].includes(value.subdistrict_id)) {

                    const subdistrict = await Subdistrict.findByPk(value.subdistrict_id);
                    
                    if(!subdistrict) {
                        return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Subdistrict Not Found'));
                    }
                    
                } else {
                    value.subdistrict_id = null;
                }
                    
                const businessType = await BusinessType.findByPk(value.business_type_id);
                if (businessType === null) {
                    return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Business Type Not Found'));
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



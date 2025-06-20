/* eslint-disable class-methods-use-this */
import { NextFunction, Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import Joi from 'joi';
import ApiError from '../helper/ApiError';
import { responseMessageConstant } from '../config/constant';
import models from '../models';

const {subdistrict: Subdistrict, business_type: BusinessType, outlet: Outlet, user: User} = models;

export default class UserValidator {

    async ownerCreateValidator(req: Request, res: Response, next: NextFunction) {
        // create schema object
        const schema = Joi.object({
            //userBody 
            username: Joi.string().pattern(/^\S*$/).required().messages({
                "string.empty": responseMessageConstant.USERNAME_422_EMPTY,
                "string.pattern.base": responseMessageConstant.USERNAME_422_INVALID_FORMAT
            }),
            password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/).required().messages({
                "string.empty": responseMessageConstant.PASSWORD_422_EMPTY,
                "string.pattern.base": responseMessageConstant.PASSWORD_422_INVALID_FORMAT
            }),
            confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
                "any.only": responseMessageConstant.PASSWORD_CONFIRMATION_422_NOT_MATCHING
            }),
            name: Joi.string().required().messages({
                "string.empty": responseMessageConstant.NAME_422_EMPTY,
                "string.pattern.base": responseMessageConstant.NAME_422_INVALID_FORMAT
            }),
            email: Joi.string().email().required().messages({
                "string.empty": responseMessageConstant.EMAIL_422_EMPTY,
                "string.email": responseMessageConstant.EMAIL_422_INVALID_FORMAT,
            }),
            phone_number: Joi.string().pattern(/^\S*$/).required().messages({
                "string.empty": responseMessageConstant.PHONENUMBER_422_EMPTY,
                "string.pattern.base": responseMessageConstant.PHONENUMBER_422_INVALID_FORMAT
            }),
            //outletBody
            business_type_id: Joi.string().guid().required().messages({
                "string.guid": '"business_type_id" must be in a valid UUID format',
            }),
            outlet_name: Joi.string().required().messages({
                "string.empty": responseMessageConstant.NAME_422_EMPTY,
            }),
            code: Joi.string().pattern(/^\S*$/).required().messages({
                "string.empty": '"Code" is not allowed to be empty',
                "string.pattern.base": '"Code" must be in a valid code format (No Spaces)'
            }),
            description: Joi.string().allow(null, ''),
            address: Joi.string().allow(null, ''),
            phone: Joi.string().pattern(/^\S*$/).required().messages({
                "string.empty": responseMessageConstant.PHONENUMBER_422_EMPTY,
                "string.pattern.base": responseMessageConstant.PHONENUMBER_422_INVALID_FORMAT
            }),
            subdistrict_id: Joi.string().guid().allow(null, '').messages({
                "string.guid": '"subdistrict_id" must be in a valid UUID format',
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
            try {
                //preprocessing
                value.password = bcrypt.hashSync(value.password!, 8);
                value.is_active = true;
                
                //username
                //LowerCase the value.username
                value.username = value.username.toLowerCase();
                //Find value.code in DB that is not self
                const ownerName = await User.findOne({
                    where: {
                        username: value.username
                    }
                });
                //if the const is true throw error
                if (ownerName){
                    return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, responseMessageConstant.USERNAME_400_TAKEN)); 
                }

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
                
                req.body = value;
                return next();
            } catch (e) {
                console.log(e);
                return next(new ApiError(httpStatus.BAD_GATEWAY, 'Validation Error' ));
            }
        }
    }

    async userCreateValidator(req: Request, res: Response, next: NextFunction) {
        // create schema object
        const schema = Joi.object({ 
            username: Joi.string().pattern(/^\S*$/).required().messages({
                "string.empty": responseMessageConstant.USERNAME_422_EMPTY,
                "string.pattern.base": responseMessageConstant.USERNAME_422_INVALID_FORMAT
            }),
            password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/).required().messages({
                "string.empty": responseMessageConstant.PASSWORD_422_EMPTY,
                "string.pattern.base": responseMessageConstant.PASSWORD_422_INVALID_FORMAT
            }),
            confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
                "any.only": responseMessageConstant.PASSWORD_CONFIRMATION_422_NOT_MATCHING
            }),
            name: Joi.string().required().messages({
                "string.empty": responseMessageConstant.NAME_422_EMPTY,
                "string.pattern.base": responseMessageConstant.NAME_422_INVALID_FORMAT
            }),
            email: Joi.string().email().required().messages({
                "string.empty": responseMessageConstant.EMAIL_422_EMPTY,
                "string.email": responseMessageConstant.EMAIL_422_INVALID_FORMAT,
            }),
            phone_number: Joi.string().pattern(/^\S*$/).required().messages({
                "string.empty": responseMessageConstant.PHONENUMBER_422_EMPTY,
                "string.pattern.base": responseMessageConstant.PHONENUMBER_422_INVALID_FORMAT
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
            try {
                value.username = value.username.toLowerCase();
                value.password = bcrypt.hashSync(value.password!, 8);
                value.is_active = true;
                value.parent_id = req.userInfo?.id
                value.outlet_id = req.userInfo?.outlet_id

                const checkName = await User.findOne({
                    where: {
                        username: value.username
                    }
                });
                //if the const is true throw error
                if (checkName){
                    return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, responseMessageConstant.USERNAME_400_TAKEN)); 
                }

                req.body = value;
                return next();
            } catch (e) {
                console.log(e);
                return next(new ApiError(httpStatus.BAD_GATEWAY, 'Validation Error' ));
            }
        }
    }

    async userUpdateValidator(req: Request, res: Response, next: NextFunction) {
        // create schema object
        const schema = Joi.object({
            first_name: Joi.string().allow(null, ''),
            last_name: Joi.string().allow(null, ''),
            is_active: Joi.boolean().messages({
                "boolean.base": responseMessageConstant.IS_ACTIVE_422_INVALID_VALUE,
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
            // on success replace req.body with validated value and trigger next middleware function
            req.body = value;
            return next();
        }
    }

    async userGetByIdValidator(req: Request, res: Response, next: NextFunction) {
        // create schema object
        const schema = Joi.object({
            id: Joi.string().guid().messages({
                "string.guid": responseMessageConstant.ID_422_INVALID_FORMAT,
            }),
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
            // on success replace req.body with validated value and trigger next middleware function
            req.body = value;
            return next();
        }
    }

    async userBulkCreateValidator(req: Request, res: Response, next: NextFunction) {
        // create schema object
        const schemaObject = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            confirm_password: Joi.string().valid(Joi.ref('password')).required(),
            first_name: Joi.string(),
            last_name: Joi.string(),
        });

        const schemaArray = Joi.array().items(schemaObject);

        const schema = Joi.alternatives().try(schemaArray, schemaObject).required();

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
            next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        } else {
            // on success replace req.body with validated value and trigger next middleware function
            req.body = value;
            return next();
        }
    }

    async userBulkCreateCsvValidator(req: Request, res: Response, next: NextFunction) {
        if (!req.file) {
            return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'csv is required'));
        } else return next();
    }

    async userLoginValidator(req: Request, res: Response, next: NextFunction) {
        // create schema object
        const schema = Joi.object({
            username: Joi.string().pattern(/^\S*$/).required().messages({
                "string.empty": responseMessageConstant.USERNAME_422_EMPTY,
                "string.pattern.base": responseMessageConstant.USERNAME_422_INVALID_FORMAT
            }),
            password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/).required().messages({
                "string.empty": responseMessageConstant.PASSWORD_422_EMPTY,
                "string.pattern.base": responseMessageConstant.PASSWORD_422_INVALID_FORMAT
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
            // on success replace req.body with validated value and trigger next middleware function
            req.body = value;
            return next();
        }
    }

    async checkUsernameValidator(req: Request, res: Response, next: NextFunction) {
        // create schema object
        const schema = Joi.object({
            username: Joi.string().pattern(/^\S*$/).required().messages({
                "string.empty": responseMessageConstant.USERNAME_422_EMPTY,
                "string.pattern.base": responseMessageConstant.USERNAME_422_INVALID_FORMAT
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
            // on success replace req.body with validated value and trigger next middleware function
            req.body = value;
            return next();
        }
    }

    async changePasswordValidator(req: Request, res: Response, next: NextFunction) {
        // create schema object
        const schema = Joi.object({
            old_password: Joi.string().required(),
            password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/).required().messages({
                "string.empty": responseMessageConstant.PASSWORD_422_EMPTY,
                "string.pattern.base": responseMessageConstant.PASSWORD_422_INVALID_FORMAT
            }),
            confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
                "any.only": responseMessageConstant.PASSWORD_CONFIRMATION_422_NOT_MATCHING
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
            next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, errorMessage));
        } else {
            // on success replace req.body with validated value and trigger next middleware function
            req.body = value;
            return next();
        }
    }
}


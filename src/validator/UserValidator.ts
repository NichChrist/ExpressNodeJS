/* eslint-disable class-methods-use-this */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi from 'joi';
import ApiError from '../helper/ApiError';
import { responseMessageConstant } from '../config/constant';


export default class UserValidator {
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
            next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, errorMessage));
        } else {
            // on success replace req.body with validated value and trigger next middleware function
            req.body = value;
            return next();
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
            next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, errorMessage));
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
            next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, errorMessage));
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
            next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, errorMessage));
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
            next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, errorMessage));
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


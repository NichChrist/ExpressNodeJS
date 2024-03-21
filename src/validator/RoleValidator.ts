/* eslint-disable class-methods-use-this */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi from 'joi';
import ApiError from '../helper/ApiError';


export default class RoleValidator {
    async roleCreateValidator(req: Request, res: Response, next: NextFunction) {
        // create schema object
        const schema = Joi.object({
            name: Joi.string().required(),
            level: Joi.number(),
            permissions: Joi.array().items(Joi.object({
                module_id: Joi.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).required(),
                module_name: Joi.string().required(),
                create: Joi.boolean().required(),
                delete: Joi.boolean().required(),
                read: Joi.boolean().required(),
                update: Joi.boolean().required(),
                reset_password: Joi.boolean(),
                change_password: Joi.boolean()
            })),
        }).messages({
            'string.pattern.base': 'Module ID have to be in UUID format',
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

    async roleUpdateValidator(req: Request, res: Response, next: NextFunction) {
        // create schema object
        const schema = Joi.object({
            name: Joi.string(),
            permissions: Joi.array().items(Joi.object({
                model_id: Joi.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).required(),
                model_name: Joi.string().required(),
                create: Joi.boolean().required(),
                delete: Joi.boolean().required(),
                read: Joi.boolean().required(),
                update: Joi.boolean().required(),
                reset_password: Joi.boolean(),
                change_password: Joi.boolean()
            })),
        }).messages({
            'string.pattern.base': 'Module ID have to be in UUID format',
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

    async reorderValidator(req: Request, res: Response, next: NextFunction) {
        // create schema object
        const schema = Joi.object({
            role_id: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)).required(),
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
            const regexError = error.details.find(detail => detail.type === 'string.pattern.base');

            if (regexError) {
                const errorMessage = 'ID have to be in UUID format';
                return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, errorMessage));
            }

            const errorMessage = error.details.map((details) => details.message).join(', ');
            return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, errorMessage));
        } else {
            req.body = value;
            return next();
        }
    }
}


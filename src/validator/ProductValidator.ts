import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi from 'joi';
import ApiError from '../helper/ApiError';

export default class ProductValidator {
    async productCreateValidator(req: Request, res: Response, next: NextFunction){
        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().allow(null, ''),
            code: Joi.string().alphanum().required(),
        })


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

    async productUpdateValidator(req: Request, res: Response, next: NextFunction){
        const schema = Joi.object({
            name: Joi.string().allow(null, ''),
            description: Joi.string().allow(null, ''),
            code: Joi.string().alphanum().required(),
        })

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
/* eslint-disable class-methods-use-this */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi from 'joi';
import ApiError from '../helper/ApiError';
import responseHandler from '../helper/responseHandler';
import models from '../models';
import { responseMessageConstant } from '../config/constant';
import { Op } from 'sequelize';

const {uom : Uom} = models;

export default class ProductValidator {

    async uomCreateValidator(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            name: Joi.string().required().messages({
                "string.empty": responseMessageConstant.NAME_422_EMPTY,
            }),
            metric_code: Joi.string().regex(/^\S+$/).required().messages({
                "string.empty": '"Metric Code" is not allowed to be empty',
                "string.pattern.base": '"Metric Code" is not allowed to have space'
            }),
            description: Joi.string().allow(null, ''),
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
                const codeCheck = await Uom.findOne({
                    where: {
                        metric_code: value.metric_code.toLowerCase(),
                    }
                })

                if (codeCheck) {
                    return next(new ApiError(httpStatus.BAD_REQUEST, 'Metric Code Taken'));
                }

                req.body = value;
                return next();
            } catch (e) {
                console.log(e);
                return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
            }
        }
    }

    async uomUpdateValidator(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            name: Joi.string().required().messages({
                "string.empty": responseMessageConstant.NAME_422_EMPTY,
            }),
            metric_code: Joi.string().regex(/^\S+$/).required().messages({
                "string.empty": '"Metric Code" is not allowed to be empty',
                "string.pattern.base": '"Metric Code" is not allowed to have space'
            }),
            description: Joi.string().allow(null, ''),
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

                const codeCheck = await Uom.findOne({
                    where: {
                        id: {
                            [Op.ne]: req.params.id
                        },
                        metric_code: value.metric_code.toLowerCase(),
                    }
                });
                if (codeCheck) {
                    return next(new ApiError(httpStatus.BAD_REQUEST, 'Metric Code Taken'));
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


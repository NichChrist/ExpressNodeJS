/* eslint-disable class-methods-use-this */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi from 'joi';
import ApiError from '../helper/ApiError';
import responseHandler from '../helper/responseHandler';
import models from '../models';
import { responseMessageConstant } from '../config/constant';

const {product_category: ProductCategory} = models;

export default class ProductValidator {

    async productCreateValidator(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            name: Joi.string().required().messages({
                "string.empty": responseMessageConstant.NAME_422_EMPTY,
            }),
            product_category_id: Joi.string().guid().messages({
                "string.empty": '"Product Category Id" is not allowed to be empty',
                "string.guid": '"Product category Id" must be in a valid UUID format',
            }),
            stock: Joi.number().messages({
                "string.empty": '"Stock" is not allowed to be empty',
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
                //product_category_id
                //value.product_category_id check does it exist
                const productCategory = await ProductCategory.findByPk(value.product_category_id);
                if (productCategory === null) {
                    return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Product Category Not Found'));
                }      
                // on success replace req.body with validated value and trigger next middleware function
                req.body = value;
                return next();
            } catch (e) {
                console.log(e);
                return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
            }
        }
    }

    async productUpdateValidator(req: Request, res: Response, next: NextFunction) {
        // create schema object
        const schema = Joi.object({
            name: Joi.string().required().messages({
                "string.empty": responseMessageConstant.NAME_422_EMPTY,
            }),
            product_category_id: Joi.string().guid().messages({
                "string.empty": '"Product Category Id" is not allowed to be empty',
                "string.guid": '"Product category Id" must be in a valid UUID format',
            }),
            stock: Joi.number().messages({
                "string.empty": '"Stock" is not allowed to be empty',
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
                //product_category_id
                //value.product_category_id check does it exist
                const productCategory = await ProductCategory.findByPk(value.product_category_id);
                if (productCategory === null) {
                    return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Product Category Not Found'));
                }      
                // on success replace req.body with validated value and trigger next middleware function
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


/* eslint-disable class-methods-use-this */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi from 'joi';
import ApiError from '../helper/ApiError';
import responseHandler from '../helper/responseHandler';
import models from '../models';
import { Op } from 'sequelize';
import { responseMessageConstant } from '../config/constant';

const {product_category: ProductCategory, product: Product} = models;

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
                const categoryCheck = await ProductCategory.findByPk(value.product_category_id);
                if (categoryCheck === null) {
                    return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Product Category Not Found'));
                }      
                // on success replace req.body with validated value and trigger next middleware function
                console.log({value})    
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
            product_category_id: Joi.string().guid().allow(null, '').messages({
                "string.guid": '"Product category Id" must be in a valid UUID format',
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
                const products = await Product.findOne({
                    where: {
                        id: req.params.id,
                    }
                });  
                
                //product_category_id
                //value.product_category_id check does it exist
                if (!['', null].includes(value.product_category_id)) {
                    const productCategories= await ProductCategory.findByPk(value.product_category_id);
                if (productCategories === null) {
                    return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Product Category Not Found'));
                } 
                console.log({value},'value Before')
                }
                //if null fill it with it own data from the DB row
                if (['', null].includes(value.product_category_id)) {
                    value.product_category_id = products.product_category_id
                }  
                console.log({value},'value After')
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

    async productGetValidator(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            name: Joi.string().allow(null, ''),
            order_by: Joi.string().allow(null, ''),
            filter: Joi.string().allow(null, ''),
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
                    const count = await Product.count({
                        where: {
                            name: {
                                [Op.iLike]: `%${value.name}%`
                            }
                        }
                    });;
                if (count===0) {
                    return next(new ApiError(httpStatus.NOT_FOUND,responseMessageConstant.PRODUCT_404_NOT_FOUND));
                }}
                
                //order_by
                if (!['', null].includes(value.order_by)) {
                    const [sortBy, sortOrder] = value.order_by.split(':');
                    if (Object.keys(Product.rawAttributes).includes(sortBy)) {
                        if (['ASC', 'DESC'].includes(sortOrder.toUpperCase())) {
                            options['order'] = [[sortBy, sortOrder.toUpperCase()]];
                        } else {
                            return next(new ApiError(httpStatus.BAD_REQUEST, `Invalid sort order '${sortOrder}'.`));
                        }
                    } else {
                        return next(new ApiError(httpStatus.BAD_REQUEST, `Column '${sortBy}' does not exist.`));
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


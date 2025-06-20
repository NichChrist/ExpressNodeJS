/* eslint-disable class-methods-use-this */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi from 'joi';
import ApiError from '../helper/ApiError';
import responseHandler from '../helper/responseHandler';
import models from '../models';
import { Op } from 'sequelize';
import { responseMessageConstant } from '../config/constant';

const {product_category: ProductCategory, product: Product, outlet: Outlet, modifier: Modifier, outlet_modifier: OutletModifier} = models;

export default class ProductValidator {

    async productCreateValidator(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            name: Joi.string().required().messages({
                "string.empty": responseMessageConstant.NAME_422_EMPTY,
            }),
            price: Joi.number().required().messages({
                "number.empty": '"Price" is not allowed to be empty'
            }),
            sku: Joi.string().regex(/^\S+$/).required().messages({
                "string.empty": '"SKU" is not allowed to be empty',
                "string.pattern.base": '"SKU" is not allowed to have space'
            }),
            product_category_id: Joi.string().guid().required().messages({
                "string.empty": '"Product Category Id" is not allowed to be empty',
                "string.guid": '"Product Category Id" must be in a valid UUID format',
            }),
            outlet_id: Joi.array().items(Joi.string().guid()).required().messages({
                "array.empty": '"Outlet Id" is not allowed to be empty',
                "array.includes": 'Each item in "Outlet Id" must be a valid UUID format'
            }),
            modifier_id: Joi.array().items(Joi.string().guid()).allow(null, '').messages({
                "array.includes": 'Each item in "Modifier Id" must be a valid UUID format'
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
                const categoryCheck = await ProductCategory.findByPk(value.product_category_id);
                if (categoryCheck === null) {
                    return next(new ApiError(httpStatus.NOT_FOUND, responseMessageConstant.ProductCategory_404_NOT_FOUND));
                }   

                value.outlet_id.forEach(async (id) => {
                    const outletIdCheck = await Outlet.findByPk(id)
                        if(outletIdCheck === null){
                            return next(new ApiError(httpStatus.NOT_FOUND, responseMessageConstant.OUTLET_404_NOT_FOUND));
                        }
                }); 

                value.modifier_id.forEach(async (id) => {
                    const modifierIdCheck = await Modifier.findByPk(id)
                        if(modifierIdCheck === null){
                            return next(new ApiError(httpStatus.NOT_FOUND, responseMessageConstant.MODIFIER_404_NOT_FOUND));
                        }
                }); 

                value.modifier_id.forEach(async (id) => {
                    const modifier = await OutletModifier.findOne({
                        where: {
                            outlet_id: req.userInfo?.outlet_id,
                            modifier_id: id
                        }
                    });
                        if(!modifier) {
                            return next(new ApiError(httpStatus.NOT_FOUND, responseMessageConstant.MODIFIER_404_NOT_FOUND));
                        }
                }); 

                value.sku = value.sku.toUpperCase();
                const skuCheck = await Product.findOne({
                    where: {
                        sku: value.sku
                    }
                })
                if (skuCheck){
                    return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, '"SKU" is unavailable'))
                }

                for (let i = 0; i < value.outlet_id.length; i++) {
                    const outlet = await Outlet.findOne({
                        where: {
                            id: value.outlet_id[i],
                        }
                    });
                    
                    if (outlet.parent_id === null){
                        if (outlet.id !== req.userInfo?.outlet_id){
                            return next(new ApiError(httpStatus.NOT_FOUND, responseMessageConstant.OUTLET_404_NOT_FOUND));
                        }
                    }else{
                        if (outlet.parent_id !== req.userInfo?.outlet_id){
                            return next(new ApiError(httpStatus.NOT_FOUND, responseMessageConstant.OUTLET_404_NOT_FOUND));
                        }
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

    async productUpdateValidator(req: Request, res: Response, next: NextFunction) {
        // create schema object
        const schema = Joi.object({
            name: Joi.string().required().messages({
                "string.empty": responseMessageConstant.NAME_422_EMPTY,
            }),
            price: Joi.number().required().messages({
                "number.empty": '"Price" is not allowed to be empty'
            }),
            sku: Joi.string().required().messages({
                "string.empty": '"SKU" is not allowed to be empty'
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

                if (!['', null].includes(value.sku)) {
                    const skuCheck = await Product.findOne({
                        where: {
                            id: {
                                [Op.ne]: req.params.id
                            },
                            sku: value.sku
                        }
                    })
                    if (skuCheck){
                        return next(new ApiError(httpStatus.NOT_FOUND, '"SKU" is unavailable'))
                    }                  
                }
                
                

                if (!['', null].includes(value.product_category_id)) {
                    const productCategories= await ProductCategory.findByPk(value.product_category_id);
                if (productCategories === null) {
                    return next(new ApiError(httpStatus.NOT_FOUND, 'Product Category Not Found'));
                } 
                }

                if (['', null].includes(value.product_category_id)) {
                    value.product_category_id = products.product_category_id
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

    async productGetValidator(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            name: Joi.string().allow(null, ''),
            order_by: Joi.string().allow(null, ''),
            filter: Joi.string().guid().allow(null, '').messages({
                "string.guid": '"Outlet Id" must be in a valid UUID format',
            }),
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
                                [Op.iLike]: `${value.name}`
                            }
                        }
                    });
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

                //filter
                if (!['', null].includes(value.filter)) {
                    const outlets = await Outlet.findOne({
                        where: {
                            id: value.filter,
                        }
                    });

                    if(!outlets){
                        return next(new ApiError (httpStatus.NOT_FOUND, responseMessageConstant.OUTLET_404_NOT_FOUND));
                    }

                    if (outlets.parent_id === null){
                        if (outlets.id !== req.userInfo?.outlet_id){
                            return next(new ApiError(httpStatus.NOT_FOUND, responseMessageConstant.OUTLET_404_NOT_FOUND));
                        }
                    }else{
                        if (outlets.parent_id !== req.userInfo?.outlet_id){
                            return next(new ApiError(httpStatus.NOT_FOUND, responseMessageConstant.OUTLET_404_NOT_FOUND));
                        }
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


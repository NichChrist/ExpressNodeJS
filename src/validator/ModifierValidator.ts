/* eslint-disable class-methods-use-this */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi from 'joi';
import ApiError from '../helper/ApiError';
import responseHandler from '../helper/responseHandler';
import models from '../models';
import { Op } from 'sequelize';
import { responseMessageConstant } from '../config/constant';

const { modifier: Modifier, outlet: Outlet, product: Product, outlet_product: OutletProduct } = models;

export default class IngredientValidator {

    async modifierCreateValidator(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            name: Joi.string().required().messages({
                "string.empty": responseMessageConstant.NAME_422_EMPTY,
            }),
            description: Joi.string().allow(null, ''),
            option_type: Joi.string().valid("allow_null", "required", "required_multiple").required().messages({
                "any.only": '"option_type" must be one of "allow_null", "required", or "required_multiple"',
                "string.empty": '"option_type" is not allowed to be empty',
            }), 
            outlet_id: Joi.array().items(Joi.string().guid()).required().messages({
                "array.empty": '"Outlet Id" is not allowed to be empty',
                "array.includes": 'Each item in "Outlet Id" must be a valid UUID format'
            }),
            modifier_detail: Joi.array().items(Joi.object({
                name: Joi.string().required().messages({
                    "array.empty": '"Outlet Id" is not allowed to be empty',
                }),
                price: Joi.number().required().messages({
                    "array.empty": '"stock" is not allowed to be empty',
                    "array.number": '"stock" must be a number',
                }), 
            })).required().messages({
                "array.empty": '"modifier details" is not allowed to be empty',
            }) 
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

                value.outlet_id.forEach(async (id) => {
                    const outletIdCheck = await Outlet.findByPk(id)
                        if(outletIdCheck === null){
                            return next(new ApiError(httpStatus.NOT_FOUND, 'Outlet Not Found'));
                        }
                }); 

                for (let i = 0; i < value.outlet_id.length; i++){
                    const outlet = await Outlet.findOne({
                        where: {
                            id: value.outlet_id[i],
                        }
                    });
                    if (outlet.parent_id === null){
                        if (outlet.id !== req.userInfo?.outlet_id){
                            return next(new ApiError(httpStatus.NOT_FOUND, 'Outlet Not Found'));
                        }
                    }else{
                        if (outlet.parent_id !== req.userInfo?.outlet_id){
                            return next(new ApiError(httpStatus.NOT_FOUND, 'Outlet Not Found'));
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

    async modifierUpdateValidator(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            name: Joi.string().required().messages({
                "string.empty": responseMessageConstant.NAME_422_EMPTY,
            }),
            description: Joi.string().allow(null, ''),
            option_type: Joi.string().valid("allow_null", "required", "required_multiple").required().messages({
                "any.only": '"option_type" must be one of "allow_null", "required", or "required_multiple"',
                "string.empty": '"option_type" is not allowed to be empty',
            }), 
            outlet_id: Joi.array().items(Joi.string().guid()).required().messages({
                "array.empty": '"Outlet Id" is not allowed to be empty',
                "array.includes": 'Each item in "Outlet Id" must be a valid UUID format'
            }),
            modifier_detail: Joi.array().items(Joi.object({
                name: Joi.string().required().messages({
                    "array.empty": '"Outlet Id" is not allowed to be empty',
                }),
                price: Joi.number().required().messages({
                    "array.empty": '"stock" is not allowed to be empty',
                    "array.number": '"stock" must be a number',
                }), 
            })).required().messages({
                "array.empty": '"modifier details" is not allowed to be empty',
            }) 
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

                value.outlet_id.forEach(async (id) => {
                    const outletIdCheck = await Outlet.findByPk(id)
                        if(outletIdCheck === null){
                            return next(new ApiError(httpStatus.NOT_FOUND, 'Outlet Not Found'));
                        }
                }); 

                for (let i = 0; i < value.outlet_id.length; i++){
                    const outlet = await Outlet.findOne({
                        where: {
                            id: value.outlet_id[i],
                        }
                    });
                    if (outlet.parent_id === null){
                        if (outlet.id !== req.userInfo?.outlet_id){
                            return next(new ApiError(httpStatus.NOT_FOUND, 'Outlet Not Found'));
                        }
                    }else{
                        if (outlet.parent_id !== req.userInfo?.outlet_id){
                            return next(new ApiError(httpStatus.NOT_FOUND, 'Outlet Not Found'));
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

    async modifierGetValidator(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            name: Joi.string().allow(null, ''),
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
                    const count = await Modifier.count({
                        where: {
                            name: {
                                [Op.iLike]: `${value.name}`
                            }
                        }
                    });
                if (count===0) {
                    return next(new ApiError(httpStatus.NOT_FOUND,responseMessageConstant.MODIFIER_404_NOT_FOUND));
                }}

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

    async csvValidator(req: Request, res: Response, next: NextFunction) {
        if (!req.file) {
            return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'csv is required'));
        } else return next();
    }

}


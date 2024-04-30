/* eslint-disable class-methods-use-this */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi, { string } from 'joi';
import ApiError from '../helper/ApiError';
import responseHandler from '../helper/responseHandler';
import models from '../models';
import { responseMessageConstant } from '../config/constant';

const {uom: Uom, outlet: Outlet, outlet_ingredient: OutletIngredient, ingredient: Ingredient } = models;

export default class IngredientValidator {

    async ingredientCreateValidator(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            name: Joi.string().required().messages({
                "string.empty": responseMessageConstant.NAME_422_EMPTY,
            }),
            uom_id: Joi.string().guid().required().messages({
                "string.empty": '"UOM Id" is not allowed to be empty',
                "string.guid": '"UOM Id" must be in a valid UUID format',
            }),
            outlet_ingredient: Joi.array().items(Joi.object({
                outlet_id: Joi.string().required().messages({
                    "array.empty": '"Outlet Id" is not allowed to be empty',
                }),
                stock: Joi.number().required().messages({
                    "array.empty": '"stock" is not allowed to be empty',
                    "array.number": '"stock" must be a number',
                }), 
            })).required().messages({
                "array.empty": '"outlet_ingredient" is not allowed to be empty',
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
                const uomCheck = await Uom.findByPk(value.uom_id);
                if (uomCheck === null) {
                    return next(new ApiError(httpStatus.NOT_FOUND, 'UOM Id Not Found'));
                }   

                value.outlet_ingredient.forEach(async (el) => {
                    const outletIdCheck = await Outlet.findByPk(el.outlet_id)
                        if(outletIdCheck === null){
                            return next(new ApiError(httpStatus.NOT_FOUND, 'Outlet Id Not Found'));
                        }
                }); 

                for (let i = 0; i < value.outlet_ingredient.length; i++) {
                    const outlet = await Outlet.findOne({
                        where: {
                            id: value.outlet_ingredient[i].outlet_id,
                        }
                    });
                    
                    if (outlet.parent_id === null){
                        if (outlet.id !== req.userInfo?.outlet_id){
                            return next(new ApiError(httpStatus.UNAUTHORIZED, 'Outlet Row ' + (i+1) + ' Is Not Your Branch'));
                        }
                    }else{
                        if (outlet.parent_id !== req.userInfo?.outlet_id){
                            return next(new ApiError(httpStatus.UNAUTHORIZED, 'Outlet Row ' + (i+1) + ' Is Not Your Branch'));
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

    async branchIngredientUpdateValidator(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            name: Joi.string().required().messages({
                "string.empty": responseMessageConstant.NAME_422_EMPTY,
            }),
            uom_id: Joi.string().guid().required().messages({
                "string.empty": '"UOM Id" is not allowed to be empty',
                "string.guid": '"UOM Id" must be in a valid UUID format',
            }),
            outlet_ingredient: Joi.array().items(Joi.object({
                outlet_id: Joi.string().required().messages({
                    "array.empty": '"Outlet Id" is not allowed to be empty',
                }),
                stock: Joi.number().required().messages({
                    "array.empty": '"stock" is not allowed to be empty',
                    "array.number": '"stock" must be a number',
                }), 
            })).required().messages({
                "array.empty": '"outlet_ingredient" is not allowed to be empty',
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
                const ingredientCheck = await Ingredient.findByPk(req.params.id);
                if (!ingredientCheck) {
                    return next(new ApiError(httpStatus.NOT_FOUND, 'Ingredient Not Found'));
                }

                const uomCheck = await Uom.findByPk(value.uom_id);
                if (!uomCheck) {
                    return next(new ApiError(httpStatus.NOT_FOUND, 'UOM Id Not Found'));
                }   

                value.outlet_ingredient.forEach(async (el) => {
                    const outletIdCheck = await Outlet.findByPk(el.outlet_id)
                        if(outletIdCheck === null){
                            return next(new ApiError(httpStatus.NOT_FOUND, 'Outlet Id Not Found'));
                        }
                });

                for (let i = 0; i < value.outlet_ingredient.length; i++) {
                    const outlet = await Outlet.findOne({
                        where: {
                            id: value.outlet_ingredient[i].outlet_id,
                        }
                    });
                    
                    if (outlet.parent_id === null){
                        if (outlet.id !== req.userInfo?.outlet_id){
                            return next(new ApiError(httpStatus.UNAUTHORIZED, 'Outlet Row ' + (i+1) + ' Is Not Your Branch'));
                        }
                    }else{
                        if (outlet.parent_id !== req.userInfo?.outlet_id){
                            return next(new ApiError(httpStatus.UNAUTHORIZED, 'Outlet Row ' + (i+1) + ' Is Not Your Branch'));
                        }
                    }
                }

                for (let i = 0; i < value.outlet_ingredient.length; i++) {
                    const outletIngredientCheck = await OutletIngredient.findOne({
                        where:{
                            outlet_id: value.outlet_ingredient[i].outlet_id,
                            ingredient_id: req.params.id
                        }})
                    if(!outletIngredientCheck){
                        return next(new ApiError(httpStatus.NOT_FOUND, 'Outlet Row ' + (i+1) + ' Do Not Have This Ingredient'));
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

    async ingredientUpdateValidator(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            name: Joi.string().required().messages({
                "string.empty": responseMessageConstant.NAME_422_EMPTY,
            }),
            uom_id: Joi.string().guid().required().messages({
                "string.empty": '"UOM Id" is not allowed to be empty',
                "string.guid": '"UOM Id" must be in a valid UUID format',
            }),
            outlet_ingredient: Joi.array().items(Joi.object({
                outlet_id: Joi.string().required().messages({
                    "array.empty": '"Outlet Id" is not allowed to be empty',
                }),
                stock: Joi.number().required().messages({
                    "array.empty": '"stock" is not allowed to be empty',
                    "array.number": '"stock" must be a number',
                }), 
            })).required().messages({
                "array.empty": '"outlet_ingredient" is not allowed to be empty',
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
                const ingredientCheck = await Ingredient.findByPk(req.params.id);
                if (!ingredientCheck) {
                    return next(new ApiError(httpStatus.NOT_FOUND, 'Ingredient Not Found'));
                }

                const uomCheck = await Uom.findByPk(value.uom_id);
                if (!uomCheck) {
                    return next(new ApiError(httpStatus.NOT_FOUND, 'UOM Id Not Found'));
                }    

                value.outlet_ingredient.forEach(async (el) => {
                    const outletIdCheck = await Outlet.findByPk(el.outlet_id)
                        if(outletIdCheck === null){
                            return next(new ApiError(httpStatus.NOT_FOUND, 'Outlet Id Not Found'));
                        }
                });

                for (let i = 0; i < value.outlet_ingredient.length; i++) {
                    const outletIngredientCheck = await OutletIngredient.findOne({
                        where:{
                            outlet_id: value.outlet_ingredient[i].outlet_id,
                            ingredient_id: req.params.id
                        }})
                    if(!outletIngredientCheck){
                        return next(new ApiError(httpStatus.NOT_FOUND, 'Outlet Row ' + (i+1) + ' Do Not Have This Ingredient'));
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


/* eslint-disable class-methods-use-this */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi, { string } from 'joi';
import ApiError from '../helper/ApiError';
import responseHandler from '../helper/responseHandler';
import models from '../models';
import { Op } from 'sequelize';
import { responseMessageConstant } from '../config/constant';

const {uom: Uom, outlet: Outlet, outlet_ingredient: OutletIngredient } = models;

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
            outlet_id: Joi.array<string>().required().messages({
                "array.empty": '"Outlet Id" is not allowed to be empty'
            }),
            stock: Joi.array().items(Joi.number()).required().messages({
                "array.empty": '"stock" is not allowed to be empty',
                "array.includes": 'Each item in "stock" must be a number'
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
                const uomCheck = await Uom.findByPk(value.uom_id);
                if (uomCheck === null) {
                    return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'UOM Id Not Found'));
                }   

                value.outlet_id.forEach(async (id) => {
                    const outletIdCheck = await Outlet.findByPk(id)
                        if(outletIdCheck === null){
                            return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Outlet Id Not Found'));
                        }
                }); 

                for (let i = 0; i < value.outlet_id.length; i++) {
                    const outlet = await Outlet.findOne({
                        where: {
                            id: value.outlet_id[i],
                        }
                    });
                    
                    if (outlet.parent_id === null){
                        if (outlet.id !== req.userInfo?.outlet_id){
                            return next(new ApiError(httpStatus.UNAUTHORIZED, 'This Outlet Is Not Your Branch'));
                        }
                    }else{
                        if (outlet.parent_id !== req.userInfo?.outlet_id){
                            return next(new ApiError(httpStatus.UNAUTHORIZED, 'This Outlet Is Not Your Branch'));
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
            outlet_id: Joi.array<string>().required().messages({
                "array.empty": '"Outlet Id" is not allowed to be empty'
            }),
            stock: Joi.array().items(Joi.number()).required().messages({
                "array.empty": '"stock" is not allowed to be empty',
                "array.includes": 'Each item in "stock" must be a number'
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
                const uomCheck = await Uom.findByPk(value.uom_id);
                if (!uomCheck) {
                    return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'UOM Id Not Found'));
                }   

                value.outlet_id.forEach(async (id) => {
                    const outletIdCheck = await Outlet.findByPk(id)
                        if(outletIdCheck === null){
                            return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Outlet Id Not Found'));
                        }
                });

                for (let i = 0; i < value.outlet_id.length; i++) {
                    const outletIngredientCheck = await OutletIngredient.findOne({
                        where:{
                            outlet_id: value.outlet_id[i],
                            ingredient_id: req.params.id
                        }})
                    if(!outletIngredientCheck){
                        return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Outlet Row' + (i+1) + ' Do Not Have This Ingredient'));
                    }          
                }

                for (let i = 0; i < value.outlet_id.length; i++) {
                    const outlet = await Outlet.findOne({
                        where: {
                            id: value.outlet_id[i],
                        }
                    });
                    
                    if (outlet.parent_id === null){
                        if (outlet.id !== req.userInfo?.outlet_id){
                            return next(new ApiError(httpStatus.UNAUTHORIZED, 'This Outlet Is Not Your Branch'));
                        }
                    }else{
                        if (outlet.parent_id !== req.userInfo?.outlet_id){
                            return next(new ApiError(httpStatus.UNAUTHORIZED, 'This Outlet Is Not Your Branch'));
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

    async ingredientUpdateValidator(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            name: Joi.string().required().messages({
                "string.empty": responseMessageConstant.NAME_422_EMPTY,
            }),
            uom_id: Joi.string().guid().required().messages({
                "string.empty": '"UOM Id" is not allowed to be empty',
                "string.guid": '"UOM Id" must be in a valid UUID format',
            }),
            outlet_id: Joi.array<string>().required().messages({
                "array.empty": '"Outlet Id" is not allowed to be empty'
            }),
            stock: Joi.array().items(Joi.number()).required().messages({
                "array.empty": '"stock" is not allowed to be empty',
                "array.includes": 'Each item in "stock" must be a number'
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
                const uomCheck = await Uom.findByPk(value.uom_id);
                if (!uomCheck) {
                    return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'UOM Id Not Found'));
                }   

                value.outlet_id.forEach(async (id) => {
                    const outletIdCheck = await Outlet.findByPk(id)
                        if(outletIdCheck === null){
                            return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Outlet Id Not Found'));
                        }
                });

                for (let i = 0; i < value.outlet_id.length; i++) {
                    const outletIngredientCheck = await OutletIngredient.findOne({
                        where:{
                            outlet_id: value.outlet_id[i],
                            ingredient_id: req.params.id
                        }})
                    if(!outletIngredientCheck){
                        return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Outlet Row' + (i+1) + ' Do Not Have This Ingredient'));
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


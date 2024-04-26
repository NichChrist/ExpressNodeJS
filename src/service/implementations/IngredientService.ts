/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
import httpStatus from 'http-status';
import { logger } from '../../config/logger';
import { Request } from 'express';
import IngredientDao from '../../dao/implementations/IngredientDao';
import { IIngredient } from '../../models/interfaces/IIngredient';
import responseHandler from '../../helper/responseHandler';
import IIngredientService from '../contracts/IIngredientService';
import db, { Sequelize, sequelize } from '../../models';
import { Op } from 'sequelize';
import { responseMessageConstant } from '../../config/constant';
import { includes } from 'lodash';

const { ingredient: Ingredient, ingredient_uom: IngredientUom, outlet_ingredient: OutletIngredient, outlet: Outlet } = db;

export default class IngredientService implements IIngredientService {
    private ingredientDao : IngredientDao


    constructor() {
        this.ingredientDao = new IngredientDao();

    }

    createIngredient = async (ingredientBody: IIngredient) => {
        return sequelize.transaction(async (t) =>{
            try {
                let data = await Ingredient.create(ingredientBody, { transaction: t }); 
                
                const uomData = {
                    ingredient_id: data.id,
                    uom_id: ingredientBody.uom_id
                }
                await IngredientUom.create(uomData, {transaction: t});
                
                const bulkData:Array<any> = [];

                for (let i = 0; i < ingredientBody.outlet_id.length; i++) {
                    bulkData.push({
                        outlet_id: ingredientBody.outlet_id[i],
                        ingredient_id: data.id, 
                        stock: ingredientBody.stock[i]
                    })
                }
                await OutletIngredient.bulkCreate(bulkData, {transaction: t})

                return responseHandler.returnSuccess(httpStatus.CREATED, responseMessageConstant.INGREDIENT_201_REGISTERED, data);
            } catch (e) {
                console.log(e);
                await t.rollback();
                return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
            }
        })
    };

    listIngredient = async (query) => {
        try {
            const { pagination, page, row } = query;
            let ingredientData = await this.ingredientDao.list(['withoutTimestamp'], pagination, page, row);
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.INGREDIENT_200_FETCHED_ALL, ingredientData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };

    dropdown = async (req: Request) => {
        try {

            const options = {
                include: [{
                    model: Ingredient,
                    attributes: [],
                }],
                attributes: [
                    [Sequelize.literal('"ingredient"."id"'), 'ingredient_id'],
                    [Sequelize.literal('"ingredient"."name"'), 'ingredient_name']
                ],
                group: ['"ingredient"."id"']
            };            

            let ingredientData = await OutletIngredient.scope(['withoutTimestamp']).findAll(options);

            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.INGREDIENT_200_FETCHED_ALL, ingredientData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };

    dropdownOutletIngredient = async (req: Request) => {
        try {
            const outlets = await Outlet.findAll({
                where: {
                    [Op.or]: [
                        {id: req.userInfo?.outlet_id},
                        {parent_id: req.userInfo?.outlet_id}
                    ],
                }
            });

            const outletIds:Array<string> = [];

            for (let i = 0; i < outlets.length; i++) {
                outletIds.push(outlets[i].id)
            }

            const options = {
                where: {
                    outlet_id : {[Op.in]: outletIds}
                },
                include: [{
                    model: Ingredient,
                    attributes: [],
                }],
                attributes: [
                    [Sequelize.literal('"ingredient"."id"'), 'ingredient_id'],
                    [Sequelize.literal('"ingredient"."name"'), 'ingredient_name']
                ],
                group: ['"ingredient"."id"']
            };            

            let ingredientData = await OutletIngredient.scope(['withoutTimestamp']).findAll(options);

            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.INGREDIENT_200_FETCHED_ALL, ingredientData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };

    getIngredientById = async (id: string) => {
        try {
            let data = await this.ingredientDao.getById(['withoutTimestamp'], id)
            if (!data) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'ingredient Not Found');
            }
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.INGREDIENT_200_FETCHED_SINGLE, data);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };

    getBranchIngredientById = async (id: string, req: Request) => {
        try {
            const outlets = await Outlet.findAll({
                where: {
                    [Op.or]: [
                        {id: req.userInfo?.outlet_id},
                        {parent_id: req.userInfo?.outlet_id}
                    ],
                }
            });

            const outletIds:Array<string> = [];

            for (let i = 0; i < outlets.length; i++) {
                outletIds.push(outlets[i].id)
            }

            let isMine = 0

            for (let i = 0; i < outletIds.length; i++) {
                const outletIngredientCheck = await OutletIngredient.findOne({
                    where:{
                        outlet_id: outletIds[i],
                        ingredient_id: req.params.id
                    }})
                if(outletIngredientCheck){
                    isMine++
                }          
            }

            if (isMine === 0){
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'ingredient Not Found');
            }

            let data = await this.ingredientDao.getById(['withoutTimestamp'], id)
            if (!data) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'ingredient Not Found');
            }
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.INGREDIENT_200_FETCHED_SINGLE, data);
        } catch (e) {
            console.error(e)
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };

    deleteBranchIngredientById = async (id: string, req: Request) => {
        return sequelize.transaction(async (t) =>{
            try {
                const outlets = await Outlet.findAll({
                    where: {
                        [Op.or]: [
                            {id: req.userInfo?.outlet_id},
                            {parent_id: req.userInfo?.outlet_id}
                        ],
                    }
                });
    
                const outletIds:Array<string> = [];
    
                for (let i = 0; i < outlets.length; i++) {
                    outletIds.push(outlets[i].id)
                }
    
                let isMine = 0
    
                for (let i = 0; i < outletIds.length; i++) {
                    const outletIngredientCheck = await OutletIngredient.findOne({
                        where:{
                            outlet_id: outletIds[i],
                            ingredient_id: req.params.id
                        }})
                    if(outletIngredientCheck){
                        isMine++
                    }          
                }

                if (isMine === 0){
                    return responseHandler.returnError(httpStatus.NOT_FOUND, 'ingredient Not Found');
                }

                await Ingredient.destroy({where: {id : id}},{transaction: t});
                await OutletIngredient.destroy({ where: { ingredient_id : id } }, {transaction: t})
                await IngredientUom.destroy({ where: { ingredient_id : id } }, {transaction: t})

                return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.INGREDIENT_200_DELETED);
            } catch (e) {
                console.log(e);
                await t.rollback();
                return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
            }
        })
    };

    deleteIngredientById = async (id: string) => {
        return sequelize.transaction(async (t) =>{
            try {
                if (!(await this.ingredientDao.isIngredientExists(id))) {
                    return responseHandler.returnError(httpStatus.NOT_FOUND, 'Ingredient Not Found');
                }

                await Ingredient.destroy({where: {id : id}},{transaction: t});
                await OutletIngredient.destroy({ where: { ingredient_id : id } }, {transaction: t})
                await IngredientUom.destroy({ where: { ingredient_id : id } }, {transaction: t})

                return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.INGREDIENT_200_DELETED);
            } catch (e) {
                console.log(e);
                await t.rollback();
                return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
            }
        })
    };

    updateIngredientById = async (id: string, ingredientBody: IIngredient) => {
        return sequelize.transaction(async (t) =>{
            try {
                if (!(await this.ingredientDao.isIngredientExists(id))) {
                    return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.Product_404_NOT_FOUND);
                }

                let updatedIngredientData = await Ingredient.update(ingredientBody, { where: { id: id } }, { transaction: t });
                await IngredientUom.update(ingredientBody, { where: { ingredient_id : id } }, { transaction: t });

                let data = await this.ingredientDao.findIngredient(id);

                const bulkData:Array<any> = [];

                for (let i = 0; i < ingredientBody.outlet_id.length; i++) {
                    bulkData.push({
                        outlet_id: ingredientBody.outlet_id[i],
                        stock: ingredientBody.stock[i]
                    })
                }

                for (let i = 0; i < ingredientBody.outlet_id.length; i++) {
                    await OutletIngredient.update(
                        bulkData[i], 
                        { 
                        where: { 
                            ingredient_id : id,
                            outlet_id : ingredientBody.outlet_id[i]
                        }},
                        {     
                            transaction: t 
                        }
                    );
                }

                if (!updatedIngredientData) {
                    return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
                }

                return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.INGREDIENT_200_UPDATED, data);
            } catch (e) {
                console.log(e);
                await t.rollback();
                return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
            }
        })
    };
}

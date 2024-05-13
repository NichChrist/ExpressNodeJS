/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
import httpStatus from 'http-status';
import { Request } from 'express';
import { IModifier } from '../../models/interfaces/IModifier';
import responseHandler from '../../helper/responseHandler';
import IModifierService from '../contracts/IModifierService';
import ModifierDao from '../../dao/implementations/ModifierDao'
import db, { sequelize } from '../../models';
import { responseMessageConstant } from '../../config/constant';
import { Op } from 'sequelize';

const { modifier: Modifier, outlet_modifier: OutletModifier, modifier_detail: ModifierDetail, product_modifier: ProductModifer, outlet: Outlet } = db;

export default class ModifierService implements IModifierService {
    private modifierDao: ModifierDao;

    constructor() {
        this.modifierDao = new ModifierDao()
    }
    
    createModifier = async (modifierBody: IModifier) => {
        try {
            await Modifier.create(modifierBody).then( async (data) => {
                    await sequelize.transaction(async (t) => {

                    const bulkOutlet:Array<any> = [];
                    modifierBody.outlet_id.forEach((outlet) => {
                        bulkOutlet.push({
                            outlet_id: outlet,
                            modifier_id: data.id
                        })
                    });
                    await OutletModifier.bulkCreate(bulkOutlet, { transaction: t });
    
                    const bulkDetail:Array<any> = [];
                    for (let i = 0; i < modifierBody.modifier_detail.length; i++) {
                        bulkDetail.push({
                            modifier_id: data.id,
                            name: modifierBody.modifier_detail[i].name,
                            price: modifierBody.modifier_detail[i].price,
                        })
                    };
                    await ModifierDetail.bulkCreate(bulkDetail, { transaction: t });
                })
            })
                return responseHandler.returnSuccess(httpStatus.CREATED, responseMessageConstant.MODIFIER_201_CREATED);
            } catch (e) {
                console.log(e);
                return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
            }
    };

    listModifier = async (name: any, filter: any, req: Request) => {
        try {
            const hasNameQueryParam = req.query.name !== undefined && req.query.name !== '';
            const hasFilterQueryParam = req.query.filter !== undefined && req.query.filter !== '';

            const pagination = req.query.pagination;
            let options:any = {
                attributes: [
                    'id',
                    'name',
                    [sequelize.literal('(SELECT COUNT(*) FROM "modifier_details" WHERE "modifier"."id" = "modifier_details"."modifier_id")'), 'quantity']
                ],
                include: [{
                    model: OutletModifier,
                    attributes: [],
                    where: {}
                },{
                    model: ModifierDetail,
                    attributes: []
                }],
            };
            const outlets = await Outlet.findOne({
                where: {
                    id: req.userInfo?.outlet_id
                }
            });
            
            if (outlets.parent_id === null){
                Object.assign(options.include[0].where, {
                    outlet_id : outlets.id 
                });
            }else{
                Object.assign(options.include[0].where, {
                    outlet_id : outlets.parent_id
                });
            }

            
            if (pagination == 'true') {
                const row: any = req.query.row;
                const page: any = req.query.page;
                const offset = (page - 1) * row;
                options['offset'] = offset;
                options['limit'] = row;
            }
            
            if (hasFilterQueryParam) {
                options.include.push({
                    model: OutletModifier,
                    where: {
                        outlet_id: filter
                    },
                    attributes: []
                });
            }

            if(hasNameQueryParam){
                options['where'] = [{ name:{[Op.iLike]: `${name}`}}];
            }

            const allData = await Modifier.findAndCountAll(options)  
            
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.MODIFIER_200_FETCHED_ALL, allData);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };

    dropdownModifier = async (req: Request) => {
        try {
            let options = {
                include: [{
                    model: OutletModifier,
                    attributes: [],
                    where: {}
                }]
            };
            const outlets = await Outlet.findOne({
                where: {
                    id: req.userInfo?.outlet_id
                }
            });
            
            if (outlets.parent_id === null){
                Object.assign(options.include[0].where, {
                    outlet_id : outlets.id 
                });
            }else{
                Object.assign(options.include[0].where, {
                    outlet_id : outlets.parent_id
                });
            }

            let data = await Modifier.scope(['dropdown']).findAll(options);
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.MODIFIER_200_FETCHED_ALL, data);
        } catch (e) {
            console.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    getModifierById = async (id: string, req: Request) => {
        try {
            if (!(await this.modifierDao.isModifierExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.MODIFIER_404_NOT_FOUND);
            }
            let modifier:any
            const outlets = await Outlet.findOne({
                where: {
                    id: req.userInfo?.outlet_id
                }
            });
            
            if (outlets.parent_id === null){
                modifier = await OutletModifier.findOne({
                    where: {
                        outlet_id: outlets.id,
                        modifier_id: id
                    }
                });
            }else{
                modifier = await OutletModifier.findOne({
                    where: {
                        outlet_id: outlets.parent_id,
                        modifier_id: id
                    }
                });
            }
            if(!modifier) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.MODIFIER_404_NOT_FOUND);
            }

            let options = {
                attributes: ['id', 'name'],
                include: [
                    {
                        model: ModifierDetail,
                        attributes: ['id','name','price']
                    },
                ],
            };

            const data = await Modifier.findAndCountAll(options);
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.MODIFIER_200_FETCHED_SINGLE, data);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    updateModifierById = async (id: string, modifierBody: IModifier, req: Request) => {
        try{
            if (!(await this.modifierDao.isModifierExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.MODIFIER_404_NOT_FOUND);
            }
 
            await sequelize.transaction(async (t) => {
                await this.modifierDao.updateById(modifierBody, id)

                await OutletModifier.destroy({
                    where: { modifier_id: id },
                    force: true
                },{ 
                    transaction: t 
                });
                await ModifierDetail.destroy({
                    where: { modifier_id: id },
                    force: true
                },{ 
                    transaction: t 
                });

                const bulkOutlet:Array<any> = [];
                modifierBody.outlet_id.forEach((outlet) => {
                    bulkOutlet.push({
                        outlet_id: outlet,
                        modifier_id: id
                    })
                });
                await OutletModifier.bulkCreate(bulkOutlet, { transaction: t });

                const bulkDetail:Array<any> = [];
                for (let i = 0; i < modifierBody.modifier_detail.length; i++) {
                    bulkDetail.push({
                        modifier_id: id,
                        name: modifierBody.modifier_detail[i].name,
                        price: modifierBody.modifier_detail[i].price,
                    })
                };
                await ModifierDetail.bulkCreate(bulkDetail, { transaction: t });
            })

            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.MODIFIER_200_UPDATED)
        }catch(e){
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    deleteModifierById = async (id: string) => {
        try{
            if (!(await this.modifierDao.isModifierExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.MODIFIER_404_NOT_FOUND);
            }
 
            await sequelize.transaction(async (t) => {

                await Modifier.destroy({
                    where: { id }
                },{ 
                    transaction: t 
                });
                await OutletModifier.destroy({
                    where: { modifier_id: id }
                },{ 
                    transaction: t 
                });
                await ModifierDetail.destroy({
                    where: { modifier_id: id }
                },{ 
                    transaction: t 
                });
                await ProductModifer.destroy({
                    where: { modifier_id: id }
                },{ 
                    transaction: t 
                });
            })

            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.MODIFIER_200_DELETED)
        }catch(e){
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }
    
    // await sequelize.transaction(async (t) => {
    //     await UomConversion.truncate({ force: true }, { transaction: t });
    //     await UomConversion.bulkCreate(uomBody, { transaction: t })
    // })

    // await UomConversion.destroy({where: { id },force: true});

    // createModifierFromCsv = async (modifierBody: IModifier[], req: Request) => {
    //     try {
    //         modifierBody.forEach(async (modifier) => {
    //             const outletIdCheck = await Outlet.findByPk(modifier.outlet_id)
    //                 if(outletIdCheck === null){
    //                     return responseHandler.returnError(httpStatus.NOT_FOUND, 'Outlet Not Found');
    //                 }
    //         }); 

    //         for (let i = 0; i < modifierBody.length; i++){
    //             const outlet = await Outlet.findOne({
    //                 where: {
    //                     id: modifierBody[i].outlet_id,
    //                 }
    //             });
    //             if (outlet.parent_id === null){
    //                 if (outlet.id !== req.userInfo?.outlet_id){
    //                     return responseHandler.returnError(httpStatus.NOT_FOUND, 'Outlet Not Found');
    //                 }
    //             }else{
    //                 if (outlet.parent_id !== req.userInfo?.outlet_id){
    //                     return responseHandler.returnError(httpStatus.NOT_FOUND, 'Outlet Not Found');
    //                 }
    //             }
    //         }

    //         for (let j = 0; j < modifierBody.length; j++){     
    //                 await Modifier.create(modifierBody[j]).then( async (data) => {
    //                     await sequelize.transaction(async (t) => {
        
    //                     const bulkOutlet:Array<any> = [];
    //                     modifierBody[j].outlet_id.forEach((outlet) => {
    //                         bulkOutlet.push({
    //                             outlet_id: outlet,  
    //                             modifier_id: data.id
    //                         })
    //                     });
    //                     await OutletModifier.bulkCreate(bulkOutlet, { transaction: t });
        
    //                     const bulkDetail:Array<any> = [];
    //                     for (let i = 0; i < modifierBody[j].modifier_detail.length; i++) {
    //                         bulkDetail.push({
    //                             modifier_id: data.id,
    //                             name: modifierBody[j].modifier_detail[i].name,
    //                             price: modifierBody[j].modifier_detail[i].price,
    //                         })
    //                     };
    //                     await ModifierDetail.bulkCreate(bulkDetail, { transaction: t });
    //                 })
    //             })
    //         }
    //         return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.MODIFIER_201_BULK_CREATED);
    //     } catch (e) {
    //         console.log(e);
    //         return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
    //     }
    // };
}
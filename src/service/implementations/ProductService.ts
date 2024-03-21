import { Request } from "express";
import httpStatus from "http-status";
import { uuid } from "uuidv4";
import responseHandler from "../../helper/responseHandler";
import { IProduct } from "../../models/interfaces/IProduct"; 
import IProductService from "../contracts/IProductService";
import { responseMessageConstant } from "../../config/constant";
import db, { sequelize } from '../../models';
import UserDao from "../../dao/implementations/UserDao";
import { Op } from "sequelize";


const { product:Product, user_products: UserProduct, user: User } = db;

export default class ProductService implements IProductService {
    private userDao: UserDao;

    constructor(){
        this.userDao = new UserDao()
    }

    createProduct = async (productBody: IProduct) => {
        try {
            const isProductExist = await Product.count({ where: { code: productBody.code } });
            let productData: any
            const id = uuid();
            productBody.id = id;

            if (isProductExist){
                return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.PRODUCT_CODE_400_TAKEN);
            }

            await sequelize.transaction(async (t) =>{
                try {
                    productData = await Product.create(productBody, {
                        transaction: t
                    })
                } catch (e) {
                    throw e
                }
            }) 

            productData = productData.toJSON();

            return responseHandler.returnSuccess(httpStatus.CREATED, responseMessageConstant.PRODUCT_201_CREATED, productData);
        } catch (e) {
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

   getProduct = async (req: Request) => {
        try {
            const pagination = req.query.pagination;
            let options = { 
                attributes:{
                    exclude: ['deleted_at']
                },
                 include: [ {
                    model: User,
                    attributes: {
                        exclude: ['created_at', 'updated_at', 'deleted_at', 'createdAt', 'updatedAt']
                    },
                    through: {
                        model: UserProduct,
                        attributes: {
                        exclude: ['created_at', 'updated_at', 'deleted_at']
                    },
                    }
                } ],
                order: [
                    ['created_at', 'DESC']
                ]
            };

            if (pagination == 'true') {
                const row: any = req.query.row;
                const page: any = req.query.page;
                const offset = (page - 1) * row;
                options['offset'] = offset;
                options['limit'] = row;
            }
            const allData = await Product.findAndCountAll(options)
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.PRODUCT_200_FETCHED_ALL, allData)
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    getProductById = async (id: string) => {
        try {
            const isProductExist = await Product.count({ where: { id } })

            if (!isProductExist){
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.PRODUCT_404_NOT_FOUND)
            }

            const productData = await Product.findOne({ 
                where: { id },
                attributes:{
                    exclude: ['deleted_at']
                },
                include: [ {
                    model: User,
                    attributes: {
                        exclude: ['created_at', 'updated_at', 'deleted_at', 'createdAt', 'updatedAt']
                    },
                    through: {
                        model: UserProduct,
                        attributes: {
                        exclude: ['created_at', 'updated_at', 'deleted_at']
                    },
                    }
                } ],
            })

            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.PRODUCT_200_FETCHED_SINGLE, productData.toJSON())
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    updateProduct = async (productBody: IProduct, id: string) => {
        try {
            const isProductExist = await Product.findOne({ where: { id } });
            const isProductCodeExist = await Product.count({ where: { 
                [Op.not]: 
                    { id },
                     code: productBody.code 
            }});


            if (!isProductExist){
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.PRODUCT_404_NOT_FOUND);
            }

            if (isProductCodeExist) { 
                return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.PRODUCT_CODE_400_TAKEN);
            }

            await sequelize.transaction(async (t) =>{
                try {
                    await isProductExist.update(productBody,  {
                        transaction: t
                    })  
                } catch (e) {
                    throw e
                }
            })

            const productData = await Product.findOne({ 
                where: { id },
                attributes:{
                    exclude: ['deleted_at']
                },
                individualHooks: true,
            })

            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.PRODUCT_200_UPDATED, productData);

        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    deleteProduct = async (id: string) => {
        try {
            const isProductExist = await Product.findOne({ where: { id } })
            if (!isProductExist){
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.PRODUCT_404_NOT_FOUND);
            }

            await sequelize.transaction(async (t) => {
                try {
                    await isProductExist.destroy({ 
                        transaction: t 
                    });
                } catch (e) {
                    throw e
                }
            })
            
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.PRODUCT_200_DELETED);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }
}
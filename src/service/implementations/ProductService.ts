/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { IProduct } from '../../models/interfaces/IProduct';
import responseHandler from '../../helper/responseHandler';
import IProductService from '../contracts/IProductService';
import ProductDao from '../../dao/implementations/ProductDao';
import ProductCategoryDao from '../../dao/implementations/ProductCategoryDao';
import db, { Sequelize, sequelize } from '../../models';
import { responseMessageConstant } from '../../config/constant';
import * as csv from 'exceljs';
import { Op } from 'sequelize';
import { includes } from 'lodash';

const { product: Product, outlet_product: OutletProduct, file: File, outlet: Outlet} = db;

export default class ProductService implements IProductService {
    private productDao: ProductDao;
    private productCategoryDao: ProductCategoryDao;

    constructor() {
        this.productDao = new ProductDao();
        this.productCategoryDao = new ProductCategoryDao();
    }

    createProduct = async (productBody: IProduct, req: Request) => {
        return sequelize.transaction(async (t) =>{
            try {
                if (req.file) {
                    let e = await File.create({
                        name: req.file?.filename,
                        mime_type: req.file?.mimetype,
                        file_path: req.file?.path,
                        is_uploaded: true,
                        is_resized: false
                    }, {
                        transaction: t
                    }); 

                    productBody.picture = e.id;
                }
                
                let data = await Product.create(productBody, { transaction: t });

                const outlets = await Outlet.findAll({
                    where: {
                        [Op.or]: [
                            {id: req.userInfo?.outlet_id},
                            {parent_id: req.userInfo?.outlet_id}
                        ],
                    }
                });

                const bulkData = outlets.map(item => {
                    return {
                        outlet_id: item.id,
                        product_id: data.id
                    }
                });

                await OutletProduct.bulkCreate(bulkData, {transaction: t}); 

                return responseHandler.returnSuccess(httpStatus.CREATED, responseMessageConstant.Product_201_REGISTERED, data);
            } catch (e) {
                console.log(e);
                await t.rollback();
                return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
            }
        })
    };

    createBulkProduct = async (productBody: IProduct[], req: Request) => {
        return sequelize.transaction(async (t) =>{
            try {

                for (let i = 0; i < productBody.length; i++) {
                    if (!(await this.productCategoryDao.isProductCategoryExists(productBody[i].product_category_id))) {
                        return responseHandler.returnError(httpStatus.NOT_FOUND, 'There is invalid Product Category Id at row ' + (i+1));
                    }
                }

                let products = await Product.bulkCreate(productBody, { transaction: t });
              
                const outlets = await Outlet.findAll({
                    where: {
                        [Op.or]: [
                            {id: req.userInfo?.outlet_id},
                            {parent_id: req.userInfo?.outlet_id}
                        ],
                    }
                });

                const bulkOutletProducts:Array<any> = [];
                console.log({outlets})
                console.log({products})
                outlets.forEach((outlet) => {
                    products.forEach((product) => {
                        bulkOutletProducts.push({
                        outlet_id: outlet.id,
                        product_id: product.id,
                        })
                    });
                });

                await OutletProduct.bulkCreate(bulkOutletProducts, {transaction: t});

                return responseHandler.returnSuccess(httpStatus.CREATED, responseMessageConstant.Product_201_REGISTERED, products);
            } catch (e) {
                console.log(e);
                await t.rollback();
                return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
            }
        })
    };

    getProduct = async (req: Request) => {
        try {
            const pagination = req.query.pagination;
            let options = {
                attributes: ['id','name'],
            };

            if (pagination == 'true') {
                const row: any = req.query.row;
                const page: any = req.query.page;
                const offset = (page - 1) * row;
                options['offset'] = offset;
                options['limit'] = row;
            }

            const allData = await Product.findAndCountAll(options)
            
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.Product_200_FETCHED_ALL, allData);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };

    getProductByName = async (name: any) => {
        try {
            if (!(await this.productDao.isProductNameExists(name))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.Product_404_NOT_FOUND);
            }

            const data = await this.productDao.findProductByName(name);

            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.Product_200_FETCHED_SINGLE, data);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };

    getProductByBranch = async (id:string, req: Request) => {
        try {
            const pagination = req.query.pagination;
            let options = { 
                where: { id },
                attributes: ['id','business_type_id','name','code'],
                include: [{
                    model: Product,
                    through: { 
                        model: OutletProduct, 
                        attributes: [],
                    },
                    attributes: {
                        include: [
                            [Sequelize.literal('"products->outlet_product"."stock"'), 'stock']
                        ], 
                        exclude: ['deleted_at','created_at','updated_at'],
                    },
                  }],
            };

            if (pagination == 'true') {
                const row: any = req.query.row;
                const page: any = req.query.page;
                const offset = (page - 1) * row;
                options['offset'] = offset;
                options['limit'] = row;
            }

            const allData = await Outlet.findAndCountAll(options)
            
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.Product_200_FETCHED_ALL, allData);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };

    deleteProductById = async (id: string) => {
        try {
            if (!(await this.productDao.isProductExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.Product_404_NOT_FOUND);
            }

            await this.productDao.deleteById(id);
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.Product_200_DELETED);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    
    updateProductById = async (id: string, name: string) => {
        try {
            if (!(await this.productDao.isProductExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.Product_404_NOT_FOUND);
            }

            let data = await this.productDao.findProduct(id);
            if (name) {
                if (await this.productDao.isProductNameExists(name)) {
                    const modelData = await Product.findOne({ where: { name: name } });

                    if (modelData.dataValues.id !== id) {
                        return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Product  with this name already exists');
                    };
                };

                data = await Product.update(
                    { name: name },
                    { where: { id: id }, returning: true, plain: true }
                );
                data = data[1].dataValues;
                delete data.deleted_at;
            }

            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.Product_200_UPDATED, data);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    exportToCSV = async (res: Response) => {
        try {
            const workbook = new csv.Workbook();
            const worksheet = workbook.addWorksheet('Product  List');

            let options = {
                attributes: {
                    exclude: ['deleted_at','created_at','updated_at']
                },
            };
            const { rows: allData } = await Product.findAndCountAll(options);

            const productColumns = [
                { key: 'id', header: 'ID', width: 36},
                { key: 'product_category_id', header: 'Product Category', width: 36},
                { key: 'name', header: 'Product Name', width: 36},
            ];
            worksheet.columns = productColumns;

            allData.forEach((rowData) => {
            worksheet.addRow(rowData);
            });

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            );
            res.setHeader(
                'Content-Disposition',
                `attachment; filename=placeholder.csv`,
            );
        
            return workbook.csv.write(res).then(() => {
                res.status(200).end();
            });
            
      } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, "Export Failed")
      }
    }
}
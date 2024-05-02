/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { IProduct } from '../../models/interfaces/IProduct';
import responseHandler from '../../helper/responseHandler';
import IProductService from '../contracts/IProductService';
import ProductDao from '../../dao/implementations/ProductDao';
import ProductCategoryDao from '../../dao/implementations/ProductCategoryDao';
import StockDao from '../../dao/implementations/StockDao';
import db, { Sequelize, sequelize } from '../../models';
import { responseMessageConstant } from '../../config/constant';
import * as csv from 'exceljs';
import { Op } from 'sequelize';

const { product: Product, outlet_product: OutletProduct, file: File, outlet: Outlet, product_category: ProductCategory} = db;

export default class ProductService implements IProductService {
    private productDao: ProductDao;
    private productCategoryDao: ProductCategoryDao;
    private stockDao: StockDao;

    constructor() {
        this.productDao = new ProductDao();
        this.productCategoryDao = new ProductCategoryDao();
        this.stockDao = new StockDao();
    }

    createProduct = async (productBody: IProduct, req: Request) => {
        return sequelize.transaction(async (t) =>{
            try {
                if (req.file) {
                    let files = await File.create({
                        name: req.file?.filename,
                        mime_type: req.file?.mimetype,
                        file_path: req.file?.path,
                        is_uploaded: true,
                        is_resized: false
                    }, {
                        transaction: t
                    }); 

                    productBody.picture = files.id;
                }
                
                let data = await Product.create(productBody, { transaction: t });

                const bulkData:Array<any> = [];

                productBody.outlet_id.forEach((outlet) => {
                    bulkData.push({
                        outlet_id: outlet,
                        product_id: data.id
                    })
                })

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

                await sequelize.transaction(async (t) => {
                    const hasSpace = (str) => /\s/.test(str);
                    const skuMap = new Map();
                    for (let i = 0; i < productBody.length; i++) {
                        const sku = productBody[i].sku;
    
                        if (skuMap.has(sku)){ 
                            throw { ec: 400, status: httpStatus.NOT_ACCEPTABLE, message: 'SKU cannot be duplicates invalid at row: ' + (i+1)}
                        };

                        if (hasSpace(sku)){
                            throw { ec: 400, status: httpStatus.NOT_ACCEPTABLE, message: 'SKU cannot be space(s) invalid at row: ' + (i+1)}
                        };
                        skuMap.set(sku, true);
                    }
                });

                for (let i = 0; i < productBody.length; i++) {
                    if (!(await this.productCategoryDao.isProductCategoryExists(productBody[i].product_category_id))) {
                        return responseHandler.returnError(httpStatus.NOT_ACCEPTABLE, 'There is invalid Product Category Id at row ' + (i+1));
                    }
                    productBody[i].sku = productBody[i].sku.toUpperCase();
                    if ((await this.productDao.isProductSkuExists(productBody[i].sku))) {
                        return responseHandler.returnError(httpStatus.NOT_ACCEPTABLE, 'There is taken SKU at row ' + (i+1));
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
                
                outlets.forEach((outlet) => {
                    products.forEach((product) => {
                        bulkOutletProducts.push({
                        outlet_id: outlet.id,
                        product_id: product.id,
                        })
                    });
                });

                await OutletProduct.bulkCreate(bulkOutletProducts, {transaction: t});

                return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.Product_201_BULK_REGISTERED);
            } catch (e:any) {
                console.log(e);
                if (e.ec) return responseHandler.returnError(e.status, e.message);   
                await t.rollback();
                return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
            }
        })
    };
    
    getProduct = async (sort: any, name: any, filter: any, req: Request) => {
        try {
            const hasNameQueryParam = req.query.name !== undefined && req.query.name !== '';
            const hasSortQueryParam = req.query.order_by !== undefined && req.query.order_by !== '';
            const hasFilterQueryParam = req.query.filter !== undefined && req.query.filter !== '';


            const pagination = req.query.pagination;
            let options = {
                attributes: ['id','name','sku','price'],
            };

            if (pagination == 'true') {
                const row: any = req.query.row;
                const page: any = req.query.page;
                const offset = (page - 1) * row;
                options['offset'] = offset;
                options['limit'] = row;
            }

            if(hasFilterQueryParam){
                options['include'] = [{
                    model: OutletProduct,
                    where: {
                        outlet_id : filter
                    },
                    attributes: [],
                }]
            }

            if(hasNameQueryParam){
                options['where'] = [{ name:{[Op.iLike]: `${name}`}}];
            }

            if(hasSortQueryParam){
                if (sort) {
                    const [sortBy, sortOrder] = sort.split(':');
                    if (Object.keys(Product.rawAttributes).includes(sortBy)) {
                        if (['ASC', 'DESC'].includes(sortOrder.toUpperCase())) {
                            options['order'] = [[sortBy, sortOrder.toUpperCase()]];
                        } else {
                            return responseHandler.returnError(httpStatus.NOT_ACCEPTABLE, `Invalid sort order '${sortOrder}'.`);
                        }
                    } else {
                        return responseHandler.returnError(httpStatus.NOT_ACCEPTABLE, `Column '${sortBy}' does not exist.`);
                    }
                }
            }

            const allData = await Product.findAndCountAll(options)  
            
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.Product_200_FETCHED_ALL, allData);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };

    getProductById = async (id: string) => {
        try {
            if (!(await this.productDao.isProductExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.Product_404_NOT_FOUND);
            }

            const Outlet = await this.productDao.findById(id);
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.Product_200_FETCHED_SINGLE, Outlet);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

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
                        group: ['"products"."id"'], 
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

            await this.stockDao.deleteById(id);
            await this.productDao.deleteById(id);
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.Product_200_DELETED);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    updateProductById = async (id: string, productBody: IProduct) => {
        try {
            if (!(await this.productDao.isProductExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.Product_404_NOT_FOUND);
            }

            let updatedProductData = await this.productDao.updateById(productBody, id);
            if (updatedProductData[0] !== 1) {
                return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
            }

            let data = await this.productDao.findProduct(id);
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
                    exclude: ['deleted_at','created_at','updated_at'],
                    include: [
                        [Sequelize.literal('"product_category"."name"'), 'product_category_name']
                    ], 
                },
                include: [{
                    model:ProductCategory,
                    attributes: [],
                    
                }]
            };
            const { rows: allData } = await Product.findAndCountAll(options);
            const productColumns = [
                { key: 'id', header: 'ID'},
                { key: 'product_category_id', header: 'Product Category'},
                { key: 'product_category_name', header: 'Product Category Name'},
                { key: 'name', header: 'Product Name'},
                { key: 'sku', header: 'SKU'},
                { key: 'price', header: 'Price'}
            ];
            worksheet.columns = productColumns;

            allData.forEach((rowData) => {
            worksheet.addRow(rowData.toJSON());
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
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import responseHandler from '../../helper/responseHandler';
import IProductCategoryService from '../contracts/IProductCategoryService';
import ProductCategoryDao from '../../dao/implementations/ProductCategoryDao';
import db, { sequelize } from '../../models';
import { responseMessageConstant } from '../../config/constant';
import * as csv from 'exceljs';

const { product_category: ProductCategory, outlet_product_category: OutletProductCategory , outlet: Outlet} = db;

export default class ProductCategoryService implements IProductCategoryService {
    private productCategoryDao: ProductCategoryDao;
    
    constructor() {
        this.productCategoryDao = new ProductCategoryDao();
    }

    createProductCategory = async (name: string, req: Request) => {
        return sequelize.transaction(async (t) =>{
            try {
                let data = await ProductCategory.create(
                    name.toLowerCase(),                    
                {
                    transaction: t        
                });

                await OutletProductCategory.create({
                    outlet_id: req.userInfo?.outlet_id,
                    product_category_id: data.id
                }, {
                    transaction: t
                }); 

                return responseHandler.returnSuccess(httpStatus.CREATED, responseMessageConstant.ProductCategory_201_REGISTERED, data);
            } catch (e) {
                console.log(e);
                await t.rollback();
                return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
            }
        })
    };
    
    createBulkProductCategory = async (name: any, req: Request) => {
        return sequelize.transaction(async (t) =>{
            try {
                const lowerCasedName = name.map((item) => ({ name: item.name.toLowerCase() }));
                
                let data = await ProductCategory.bulkCreate(lowerCasedName, { transaction: t });
                
                const bulkData = data.map(item => {
                    return {
                        outlet_id: req.userInfo?.outlet_id,
                        product_category_id: item.id
                    }
                });
    
                await OutletProductCategory.bulkCreate(bulkData, { transaction: t });
    
                return responseHandler.returnSuccess(httpStatus.CREATED, responseMessageConstant.ProductCategory_201_REGISTERED, data);
            } catch (e) {
                console.log(e);
                await t.rollback();
                return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
            }
        })
    };

    getProductCategories = async (req: Request) => {
        try {
            const pagination = req.query.pagination;
            let options = {
                attributes: {
                    exclude: ['deleted_at']
                },
            };
            if (pagination == 'true') {
                const row: any = req.query.row;
                const page: any = req.query.page;
                const offset = (page - 1) * row;
                options['offset'] = offset;
                options['limit'] = row;
            }

            const allData = await ProductCategory.findAndCountAll(options)
            
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.ProductCategory_200_FETCHED_ALL, allData);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };

    getProductCategoryByName = async (name: any) => {
        try {
            name.toLowerCase();
            if (!(await this.productCategoryDao.isProductCategoryNameExists(name))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.ProductCategory_404_NOT_FOUND);
            }

            const data = await this.productCategoryDao.findProductCategoryByName(name);

            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.ProductCategory_200_FETCHED_SINGLE, data);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };

    getProductCategoriesByBranch = async (id:string, req: Request) => {
        try {
            const pagination = req.query.pagination;
            let options = { 
                where: { id },
                include: [{
                    model: ProductCategory,
                    through: { 
                      model: OutletProductCategory, 
                    },
                    attributes: { 
                      exclude: ['deleted_at'],
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
            
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.ProductCategory_200_FETCHED_ALL, allData);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };

    deleteProductCategoryById = async (id: string) => {
        try {
            if (!(await this.productCategoryDao.isProductCategoryExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.ProductCategory_404_NOT_FOUND);
            }

            await this.productCategoryDao.deleteById(id);
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.ProductCategory_200_DELETED);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    updateProductCategoryById = async (id: string, name: string) => {
        try {
            name.toLowerCase();
            if (!(await this.productCategoryDao.isProductCategoryExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.ProductCategory_404_NOT_FOUND);
            }

            let data = await this.productCategoryDao.findProductCategory(id);
            if (name) {
                data = await ProductCategory.update(
                    { name: name },
                    { where: { id: id }, returning: true, plain: true }
                );
                data = data[1].dataValues;
                delete data.deleted_at;
            }

            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.ProductCategory_200_UPDATED, data);
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    exportToCSV = async (res: Response) => {
        try {
            const workbook = new csv.Workbook();
            const worksheet = workbook.addWorksheet('Product Category List');

            let options = {
                attributes: {
                    exclude: ['deleted_at','created_at','updated_at']
                },
            };
            const { rows: allData } = await ProductCategory.findAndCountAll(options);

            const productCategoryColumns = [
                { key: 'id', header: 'ID', width: 36},
                { key: 'name', header: 'Product Category', width: 36},
            ];
            worksheet.columns = productCategoryColumns;

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

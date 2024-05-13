/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
import httpStatus from 'http-status';
import { Response } from 'express';
import { IStock } from '../../models/interfaces/IStock';
import responseHandler from '../../helper/responseHandler';
import IStockService from '../contracts/IStockService';
import StockDao from '../../dao/implementations/StockDao';
import db, { Sequelize } from '../../models';
import { responseMessageConstant } from '../../config/constant';
import * as csv from 'exceljs';
import { logger } from '../../config/logger';

const { outlet_product: OutletProduct, product: Product} = db;

export default class StockService implements IStockService {
    private stockDao: StockDao;

    constructor() {
        this.stockDao = new StockDao();
    }

    listStock = async (query) => {
        try {
            const { pagination, page, row } = query;
            let stockData = await this.stockDao.list(['withoutTimestamp'], pagination, page, row);
            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Fetched All Product Stock', stockData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    getStockById = async (id: string) => {
        try {
            let userData = await this.stockDao.getById(['withoutTimestamp'], id)
            if (!userData) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'Product Not Found');
            }
            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Fetched A Single Product Stock', userData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };

    deleteStockById = async (id: string) => {
        try {
            if (!(await this.stockDao.isStockExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'Product Not Found');
            }

            await this.stockDao.deleteById(id);
            return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Deleted A Stock');
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    
    updateStockById = async (id: string, stockBody: IStock) => {
        try {
            if (!(await this.stockDao.isStockExists(id))) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.PRODUCT_404_NOT_FOUND);
            }

            let updatedStockData = await this.stockDao.updateById(stockBody, id);
            if (updatedStockData[0] !== 1) {
                return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
            }

            let data = await this.stockDao.getById(['withoutTimestamp'],id);

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
                        [Sequelize.literal('"product"."name"'), 'product_name']
                    ], 
                },
                include: [{
                    model:Product,
                    attributes: [],
                    
                }]
                
            };
            const { rows: allData } = await OutletProduct.findAndCountAll(options);

            const productColumns = [
                { key: 'id', header: 'ID'},
                { key: 'outlet_id', header: 'Outlet Id'},
                { key: 'product_id', header: 'Product Id'},
                { key: 'product_name', header: 'Product Name' },
                { key: 'stock', header: 'Stock'}
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
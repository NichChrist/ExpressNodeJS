import models from '../../models';
import IProductDao from '../contracts/IProductDao'
import SuperDao from './SuperDao';
import { Op } from 'sequelize';

const { product: Product } = models;

export default class ModelDao extends SuperDao implements IProductDao {
    constructor() {
        super(Product);
    }

    async isProductExists(id: string) {
        return Product.count({ where: { id } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    };

    async isProductNameExists(name: string) {
        return Product.count({ 
            where:{ 
                name:{
                    [Op.iLike]: `${name}`
                    }}}
                ).then((count) => {
                    if (count != 0) {
                        return true;
                }
                return false;
            }
        );
    };

    async isProductSkuExists(sku: string) {
        return Product.count({ where: { sku }}).then((count) => {
                    if (count != 0) {
                        return true;
                }
                return false;
            }
        );
    };

    async deleteById(id: string) {
        return Product.destroy({ where: { id } });
    }

    async findProduct(id: string) {
        return Product.findOne({
            attributes: {
                exclude: ['deleted_at']
            },
            where: { id: id }
        })
    }

    async getProductByName(name: string) {
        return Product.findAndCountAll({
            attributes: ['id','name'],
            where:{ 
                name:{
                    [Op.iLike]: `${name}`
            }}
        })
    }
}

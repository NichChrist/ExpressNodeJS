import models from '../../models';
import IProductDao from '../contracts/IProductDao'
import SuperDao from './SuperDao';

const { product: Product } = models;

export default class ModelDao extends SuperDao implements IProductDao {
    constructor() {
        super(Product);
    }

    async getProductByName(name: string) {
        return Product.findOne({
            where: {name: name},
        });
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
        return Product.count({ where: { name } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
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

    async findProductByName(name: string) {
        return Product.findOne({
            attributes: {
                exclude: ['deleted_at']
            },
            where: { name: name }
        })
    }
}

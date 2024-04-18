import models from '../../models';
import IProductCategoryDao from '../contracts/IProductCategoryDao';
import SuperDao from './SuperDao';

const { product_category: ProductCategory } = models;

export default class ModelDao extends SuperDao implements IProductCategoryDao {
    constructor() {
        super(ProductCategory);
    }

    async getProductCategoryByName(name: string) {
        return ProductCategory.findOne({
            where: {name: name},
        });
    }

    async isProductCategoryExists(id: string) {
        return ProductCategory.count({ where: { id } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    };

    async isProductCategoryNameExists(name: string) {
        return ProductCategory.count({ where: { name } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    };

    async deleteById(id: string) {
        return ProductCategory.destroy({ where: { id } });
    }

    async findProductCategory(id: string) {
        return ProductCategory.findOne({
            attributes: {
                exclude: ['deleted_at']
            },
            where: { id: id }
        })
    }

    async findProductCategoryByName(name: string) {
        return ProductCategory.findOne({
            attributes: {
                exclude: ['deleted_at']
            },
            where: { name: name }
        })
    }
}

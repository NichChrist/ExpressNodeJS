import models from '../../models';
import IStockDao from '../contracts/IStockDao';
import SuperDao from './SuperDao';

const Stock = models.outlet_product;

export default class StockDao extends SuperDao implements IStockDao {
    constructor() {
        super(Stock);
    }

    async list(scopes, pagination = 'true', page = 1, row = 10) {
        const option = {};

        if (pagination !== 'false') {
            Object.assign(option, {
                offset: (+page - 1) * +row,
                limit: +row,
            });
        }

        return Stock.scope(scopes).findAll(option);
    }
    
    async isStockExists(id: string) {
        return Stock.count({ where: { id } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    };
    
    async getById(scopes, id) {
        return Stock.scope(scopes).findOne({ where: { id } });
    }

    async deleteById(id: string) {
        return Stock.destroy({ where: { id } });
    }

}

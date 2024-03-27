import models from '../../models';
import ICityDao from '../contracts/ICityDao';
import SuperDao from './SuperDao';

const City = models.city;

export default class CityDao extends SuperDao implements ICityDao {
    constructor() {
        super(City);
    }

    async list(scopes, pagination = 'true', page = 1, row = 10) {
        const option = {};

        if (pagination !== 'false') {
            Object.assign(option, {
                offset: (+page - 1) * +row,
                limit: +row,
            });
        }

        return City.scope(scopes).findAll(option);
    }

    async getById(scopes, id) {
        return City.scope(scopes).findOne({ where: { id } });
    }

}

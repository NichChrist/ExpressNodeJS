import models from '../../models';
import IDistrictDao from '../contracts/IDistrictDao';
import SuperDao from './SuperDao';

const District = models.district;

export default class DistrictDao extends SuperDao implements IDistrictDao {
    constructor() {
        super(District);
    }

    async list(scopes, pagination = 'true', page = 1, row = 10) {
        const option = {};

        if (pagination !== 'false') {
            Object.assign(option, {
                offset: (+page - 1) * +row,
                limit: +row,
            });
        }

        return District.scope(scopes).findAll(option);
    }

    async getById(scopes, id) {
        return District.scope(scopes).findOne({ where: { id } });
    }

}

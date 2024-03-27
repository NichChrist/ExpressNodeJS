import models from '../../models';
import IProvinceDao from '../contracts/IProvinceDao';
import SuperDao from './SuperDao';

const Province = models.province;

export default class ProvinceDao extends SuperDao implements IProvinceDao {
    constructor() {
        super(Province);
    }

    async list(scopes, pagination = 'true', page = 1, row = 10) {
        const option = {};

        if (pagination !== 'false') {
            Object.assign(option, {
                offset: (+page - 1) * +row,
                limit: +row,
            });
        }

        return Province.scope(scopes).findAll(option);
    }

    async getById(scopes, id) {
        return Province.scope(scopes).findOne({ where: { id } });
    }

}

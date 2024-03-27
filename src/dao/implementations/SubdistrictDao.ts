import models from '../../models';
import ISubdistrictDao from '../contracts/ISubdistrictDao';
import SuperDao from './SuperDao';

const Subdistrict = models.subdistrict;

export default class SubdistrictDao extends SuperDao implements ISubdistrictDao {
    constructor() {
        super(Subdistrict);
    }

    async list(scopes, pagination = 'true', page = 1, row = 10) {
        const option = {};

        if (pagination !== 'false') {
            Object.assign(option, {
                offset: (+page - 1) * +row,
                limit: +row,
            });
        }

        return Subdistrict.scope(scopes).findAll(option);
    }

    async getById(scopes, id) {
        return Subdistrict.scope(scopes).findOne({ where: { id } });
    }

}

import models from '../../models';
import IUomDao from '../contracts/IUomDao'
import SuperDao from './SuperDao';
import { Op } from 'sequelize';

const { uom: Uom } = models;

export default class ModelDao extends SuperDao implements IUomDao {
    constructor() {
        super(Uom);
    }

    async list(scopes, pagination = 'true', page = 1, row = 10) {
        const option = {};

        if (pagination !== 'false') {
            Object.assign(option, {
                offset: (+page - 1) * +row,
                limit: +row,
            });
        }

        return Uom.scope(scopes).findAll(option);
    }

    async isUomExists(id: string) {
        return Uom.count({ where: { id } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    };

    async deleteById(id: string) {
        return Uom.destroy({ where: { id } });
    }

    async getUomByName(name: string) {
        return Uom.findAndCountAll({
            attributes: ['id','name'],
            where:{ 
                name:{
                    [Op.iLike]: `${name}`
            }}
        })
    }
}

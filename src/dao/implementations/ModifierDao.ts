import models from '../../models';
import IModifierDao from '../contracts/IModifierDao'
import SuperDao from './SuperDao';
import { Op } from 'sequelize';

const { modifier: Modifier } = models;

export default class ModelDao extends SuperDao implements IModifierDao {
    constructor() {
        super(Modifier);
    }

    async list(scopes, pagination = 'true', page = 1, row = 10) {
        const option = {};

        if (pagination !== 'false') {
            Object.assign(option, {
                offset: (+page - 1) * +row,
                limit: +row,
            });
        }

        return Modifier.scope(scopes).findAll(option);
    }

    async isModifierExists(id: string) {
        return Modifier.count({ where: { id } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    };

    async isModifierNameExists(name: string) {
        return Modifier.count({ 
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

    
    async getModifierById(id: string) {
        return Modifier.findOne({
            attributes: {
                exclude: ['deleted_at']
            },
            where: { id: id }
        })
    };
    
    async getModifierByName(name: string) {
        return Modifier.findAndCountAll({
            attributes: ['id','name'],
            where:{ 
                name:{
                    [Op.iLike]: `${name}`
                }
            }
        })
    };
    
    async deleteById(id: string) {
        return Modifier.destroy({ where: { id } });
    };

}
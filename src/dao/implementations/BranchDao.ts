import models from '../../models';
import IBranchDao from '../contracts/IBranchDao';
import SuperDao from './SuperDao';
import { Op } from 'sequelize';

const { outlet: Outlet } = models;

export default class BranchDao extends SuperDao implements IBranchDao {
    constructor() {
        super(Outlet);
    }

    async list(scopes, pagination = 'true', page = 1, row = 10) {
        const option = {};

        if (pagination !== 'false') {
            Object.assign(option, {
                offset: (+page - 1) * +row,
                limit: +row,
            });
        }

        return Outlet.scope(scopes).findAll(option);
    }

    async isBranchExists(id: string) {
        return Outlet.count({ where: { id } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    }

    async isBranchNameExists(name: string) {
        return Outlet.count({ 
            where: { 
                name:{
                    [Op.iLike]: `${name}` 
                }}}
            ).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    }

    async isBranchCodeExists(code: string) {
        return Outlet.count({ where: { code } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    }

    
    async deleteById(id: string) {
        return Outlet.destroy({ where: { id } });
    }
    
    async getById(id: string) {
        return Outlet.findOne({
            attributes: {
                exclude: ['deleted_at']
            },
            where: { id: id }
        })
    }

}

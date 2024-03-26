import models from '../../models';
import IOutletDao from '../contracts/IOutletDao';
import SuperDao from './SuperDao';

const { outlet: Outlet } = models;

export default class OutletDao extends SuperDao implements IOutletDao {
    constructor() {
        super(Outlet);
    }

    async isOutletExists(id: string) {
        return Outlet.count({ where: { id } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    }

    async isOutletNameExists(name: string) {
        return Outlet.count({ where: { name } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    }

    async isOutletCodeExists(code: string) {
        return Outlet.count({ where: { code } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    }

    
    async deleteById(id) {
        return Outlet.destroy({ where: { id } });
    }
    
    async findOutlet(id: string) {
        return Outlet.findOne({
            attributes: {
                exclude: ['deleted_at']
            },
            where: { id: id }
        })
    }
    
    async getById(id) {
        return Outlet.findOne({ where: { id } });
    }

}

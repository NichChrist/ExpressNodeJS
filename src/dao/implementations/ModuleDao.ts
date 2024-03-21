import models from '../../models';
import IModuleDao from '../contracts/IModuleDao';
import SuperDao from './SuperDao';

const Module = models.module;

export default class ModuleDao extends SuperDao implements IModuleDao {
    constructor() {
        super(Module);
    }

    async getModuleNameById(id: string, name: string) {
        return Module.findOne({
            where: { id: id, name: name },
        });
    }

    async isModuleExists(id: string) {
        return Module.count({ where: { id } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    };

    async isModuleNameExists(name: string) {
        return Module.count({ where: { name } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    };

    async findModule(id: string) {
        return Module.findOne({
            attributes: {
                exclude: ['deleted_at']
            },
            where: { id: id }
        })
    }
}

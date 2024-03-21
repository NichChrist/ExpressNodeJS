import models from '../../models';
import IModelDao from '../contracts/IModelDao';
import SuperDao from './SuperDao';

const { model: Model } = models;

export default class ModelDao extends SuperDao implements IModelDao {
    constructor() {
        super(Model);
    }

    async getModelNameById(id: string, name: string) {
        return Model.findOne({
            where: { id: id, name: name },
        });
    }

    async isModelExists(id: string) {
        return Model.count({ where: { id } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    };

    async isModelNameExists(name: string) {
        return Model.count({ where: { name } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    };

    async findModel(id: string) {
        return Model.findOne({
            attributes: {
                exclude: ['deleted_at']
            },
            where: { id: id }
        })
    }
}

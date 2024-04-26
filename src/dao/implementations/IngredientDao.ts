import models from '../../models';
import IIngredientDao from '../contracts/IIngredientDao';
import SuperDao from './SuperDao';

const Ingredient = models.ingredient;

export default class IngredientDao extends SuperDao implements IIngredientDao {
    constructor() {
        super(Ingredient);
    }

    async list(scopes, pagination = 'true', page = 1, row = 10) {
        const option = {};

        if (pagination !== 'false') {
            Object.assign(option, {
                offset: (+page - 1) * +row,
                limit: +row,
            });
        }

        return Ingredient.scope(scopes).findAll(option);
    }

    async findIngredient(id: string) {
        return Ingredient.findOne({
            attributes: {
                exclude: ['deleted_at']
            },
            where: { id: id }
        })
    }

    async getById(scopes, id) {
        return Ingredient.scope(scopes).findOne({ where: { id } });
    }

    async isIngredientExists(id: string) {
        return Ingredient.count({ where: { id } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    };

    async deleteById(id) {
        return Ingredient.destroy({ where: { id } });
    }

}

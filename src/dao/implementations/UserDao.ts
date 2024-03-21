import models from '../../models';
import IUserDao from '../contracts/IUserDao';
import SuperDao from './SuperDao';

const User = models.user;

export default class UserDao extends SuperDao implements IUserDao {
    constructor() {
        super(User);
    }

    async list(scopes, pagination = 'true', page = 1, row = 10) {
        const option = {};

        if (pagination !== 'false') {
            Object.assign(option, {
                offset: (+page - 1) * +row,
                limit: +row,
            });
        }

        return User.scope(scopes).findAll(option);
    }

    async getById(scopes, id) {
        return User.scope(scopes).findOne({ where: { id } });
    }

    async deleteById(id) {
        return User.destroy({ where: { id } });
    }

    async getByEmail(email: string) {
        return User.findOne({ where: { email } });
    }

    async isEmailExists(email: string) {
        return User.count({ where: { email } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    }

    async createWithTransaction(user: object, transaction: object) {
        return User.create(user, { transaction });
    }
}

import model from '../../models';
import IBusinessTypeDao from '../contracts/IBusinessTypeDao';
import SuperDao from './SuperDao';

const { business_type: BusinessType } = model;

export default class BusinessTypeDao extends SuperDao implements IBusinessTypeDao {
    constructor() {
        super(BusinessType);
    }

    async getBusinessTypeNameById(id: string, name: string) {
        return BusinessType.findOne({
            where: { id: id, name: name },
        });
    }

    async isBusinessTypeExists(id: string) {
        return BusinessType.count({ where: { id } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    };

    async isBusinessTypeNameExists(name: string) {
        return BusinessType.count({ where: { name } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    };

    async deleteById(id) {
        return BusinessType.destroy({ where: { id } });
    };

    async findBusinessType(id: string) {
        return BusinessType.findOne({
            attributes: {
                exclude: ['deleted_at']
            },
            where: { id: id }
        })
    }
}

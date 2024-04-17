const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OutletProductCategories extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    OutletProductCategories.init(
        {},
        {
            sequelize,
            modelName: 'outlet_product_category',
            underscored: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    );
    return OutletProductCategories;
};

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserProduct extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    UserProduct.init(
        {},
        {
            sequelize,
            modelName: 'user_product',
            underscored: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    );
    return UserProduct;
};

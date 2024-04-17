const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class IngredientUom extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here

        }
    }

    IngredientUom.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            stock: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
        },
        {
            scopes: {
                withoutTimestamp: {
                    attributes: { exclude: ['created_at', 'updated_at', 'deleted_at'] },
                },
            },
            sequelize,
            modelName: 'ingredient_uom',
            underscored: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    );
    return IngredientUom;
};

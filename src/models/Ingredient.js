const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Ingredient extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Ingredient.belongsToMany(models.product, {
                through: 'recipe',
                foreignKey: 'ingredient_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });

            Ingredient.belongsToMany(models.outlet, {
                through: 'outlet_ingredient',
                foreignKey: 'ingredient_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });

            Ingredient.belongsToMany(models.uom, {
                through: 'ingredient_uom',
                foreignKey: 'ingredient_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });
        }
    }

    Ingredient.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            }           
        },
        {
            scopes: {
                withoutTimestamp: {
                    attributes: { exclude: ['created_at', 'updated_at', 'deleted_at'] },
                }
            },
            sequelize,
            modelName: 'ingredient',
            underscored: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    );
    return Ingredient;
};

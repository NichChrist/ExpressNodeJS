const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Uom extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Uom.hasMany(models.uom_conversion, {
                foreignKey: 'uom_from_id',
                sourceKey: 'id',
                as: 'uom_conversion_from',
            });
            
            Uom.hasMany(models.uom_conversion, {
                foreignKey: 'uom_to_id',
                sourceKey: 'id',
                as: 'uom_conversion_to',
            });

            Uom.belongsToMany(models.outlet, {
                through: 'outlet_uom',
                foreignKey: 'uom_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });

            Uom.belongsToMany(models.ingredient, {
                through: 'ingredient_uom',
                foreignKey: 'uom_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });

            Uom.belongsToMany(models.product, {
                through: 'product_uom',
                foreignKey: 'uom_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });

            Uom.hasMany(models.outlet_uom,{
                foreignKey: 'uom_id'
            });
        }
    }

    Uom.init(
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
            },
            metric_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            }
        },
        {
            scopes: {
                dropdown: {
                    attributes: [
                        'id',
                        'name',
                    ]
                },
            },
            sequelize,
            modelName: 'uom',
            underscored: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at'
        },
    );
    return Uom;
};

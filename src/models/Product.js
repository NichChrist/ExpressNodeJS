const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Product.belongsToMany(models.modifier, {
                through: 'product_modifiers',
                foreignKey: 'product_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });

            Product.belongsToMany(models.ingredient, {
                through: 'recipe',
                foreignKey: 'product_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });

            Product.belongsToMany(models.outlet, {
                through: 'outlet_product',
                foreignKey: 'product_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });

            Product.belongsToMany(models.uom, {
                through: 'product_uom',
                foreignKey: 'product_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });

            Product.belongsTo(models.product_category,{
                foreignKey: 'product_category_id',
            });

            Product.hasMany(models.outlet_product,{
                foreignKey: 'product_id'
            });
        }
    }

    Product.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            product_category_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            picture: {
                type: DataTypes.UUID,
                allowNull: true
            },
            price: {
                type: DataTypes.DECIMAL,
                allowNull: false
            },
            sku: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            scopes: {
                dropdown: {
                    attributes: [
                        'id',
                        'name',
                        'sku'
                    ]
                }
            },
            sequelize,
            modelName: 'product',
            underscored: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    );
    return Product;
};

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ProductCategory extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            ProductCategory.hasMany(models.product, {
                foreignKey: 'product_category_id',
                hooks: true,
            });

            ProductCategory.belongsToMany(models.outlet, {
                through: 'outlet_product_category',
                foreignKey: 'product_category_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });
        }
    }

    ProductCategory.init(
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
        },
        {
            sequelize,
            modelName: 'product_category',
            underscored: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    );
    return ProductCategory;
};

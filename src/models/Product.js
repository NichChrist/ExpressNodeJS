const { Model } = require('sequelize');
const db = require('../models');

function toTitleCase(name) {
    return name.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

const { activity_log: ActivityLog } = db;

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Product.belongsToMany(models.user, {
                through: 'user_product',
                foreignKey: 'product_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });
        }
    }
    Product.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV1,
                primaryKey: true,
                allowNull: false,
            },
            name: DataTypes.STRING,
            description: DataTypes.TEXT,
            code: DataTypes.STRING(5),
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
            deleted_at: DataTypes.DATE,
        },
        {
            hooks: {
                beforeCreate: (product, options) => {
                    console.log('Input data initialized');
                    product.name = toTitleCase(product.name);
                },
                beforeUpdate: (product, options) => {
                    console.log(product.dataValues);
                    console.log('Update data initialized');
                    product.dataValues.name = toTitleCase(product.dataValues.name);
                },
                afterCreate: (product, options) => {
                    console.log('\nNew Data inputted: ' + product.id);
                    sequelize.models.activity_log.create({
                        table: 'Product',
                        target_id: product.id,
                        action: 'create',
                    });
                },
                afterUpdate: (product, options) => {
                    console.log('\nA data updated: ' + product.dataValues.id);
                    sequelize.models.activity_log.create({
                        table: 'Product',
                        target_id: product.dataValues.id,
                        action: 'update',
                    });
                },
                afterDestroy: (product, options) => {
                    console.log('\nA data destroyed: ' + product.dataValues.id);
                    sequelize.models.activity_log.create({
                        table: 'Product',
                        target_id: product.dataValues.id,
                        action: 'delete',
                    });
                },
            },

            indexes: [
                {
                    unique: true,
                    fields: ['code'],
                },
                {
                    fields: ['description'],
                },
                {
                    fields: ['code', 'description'],
                },
            ],
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

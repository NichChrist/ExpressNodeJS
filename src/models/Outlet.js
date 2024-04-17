const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Outlet extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here  
            Outlet.belongsTo(models.outlet, {
                foreignKey: 'parent_id',
                hooks: true,
                as: 'parent',
            });

            Outlet.hasMany(models.user, {
                foreignKey: 'outlet_id',
                hooks: true,
            });
            
            Outlet.hasMany(models.transaction, {
                foreignKey: 'outlet_id',
                hooks: true,
            });

            Outlet.belongsToMany(models.discount, {
                through: 'outlet_discount',
                foreignKey: 'outlet_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });

            Outlet.belongsToMany(models.tax, {
                through: 'outlet_tax',
                foreignKey: 'outlet_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });

            Outlet.belongsToMany(models.product_category, {
                through: 'outlet_product_category',
                foreignKey: 'outlet_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });

            Outlet.belongsToMany(models.payment_method, {
                through: 'outlet_payment_method',
                foreignKey: 'outlet_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });

            Outlet.belongsToMany(models.modifier, {
                through: 'outlet_modifier',
                foreignKey: 'outlet_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });

        }
    }

    Outlet.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            business_type_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            code: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            address: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            parent_id: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            subdistrict_id: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            phone: {
                type: DataTypes.STRING,
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
            modelName: 'outlet',
            underscored: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    );
    return Outlet;
};

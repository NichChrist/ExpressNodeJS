const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Modifier extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Modifier.belongsToMany(models.outlet, {
                through: 'outlet_modifiers',
                foreignKey: 'modifier_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });

            Modifier.belongsToMany(models.product, {
                through: 'product_modifiers',
                foreignKey: 'modifier_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });

            Modifier.hasMany(models.modifier_detail, {
                foreignKey: 'modifier_id',
                hooks: true,
            });

            Modifier.hasMany(models.outlet_modifier,{
                foreignKey: 'modifier_id',
                hooks: true,
            });
        }
    }

    Modifier.init(
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
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            option_type:{
                type: DataTypes.STRING,
                allowNull: false,
            },           
        },
        {
            scopes: {
                dropdown: {
                    attributes: [
                        'id',
                        'name'
                    ]
                }
            },
            sequelize,
            modelName: 'modifier',
            underscored: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    );
    return Modifier;
};

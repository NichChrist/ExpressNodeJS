const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OutletModifier extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            OutletModifier.belongsTo(models.modifier, 
                { foreignKey: 'modifier_id' 
            });
            
        }
    }

    OutletModifier.init(
        {
            outlet_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
            },
            modifier_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'outlet_modifier',
            underscored: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    );
    return OutletModifier;
};

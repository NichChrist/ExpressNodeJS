const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UomConversions extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            UomConversions.belongsTo(models.uom, {
                foreignKey: 'uom_from_id',
                targetKey: 'id',
                as: 'uom_from',
            });
            
            UomConversions.belongsTo(models.uom, {
                foreignKey: 'uom_to_id',
                targetKey: 'id',
                as: 'uom_to',
            });
        }
    }

    UomConversions.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            uom_from_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            uom_to_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            multiplier: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            }
        },
        {
            sequelize,
            modelName: 'uom_conversion',
            underscored: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at'
        },
    );
    return UomConversions;
};

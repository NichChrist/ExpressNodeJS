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
            Uom.hasMany(models.uom_conversions, {
                foreignKey: 'uoms_from_id',
                sourceKey: 'id',
                as: 'uoms_conversion_from',
            });
            
            Uom.hasMany(models.uom_conversions, {
                foreignKey: 'uoms_to_id',
                sourceKey: 'id',
                as: 'uoms_conversion_to',
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
                allowNull: false,
            }
        },
        {
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

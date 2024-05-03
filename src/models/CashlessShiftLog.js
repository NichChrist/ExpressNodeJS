const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class CashlessShiftLog extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    CashlessShiftLog.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            shift_log_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            cashless_type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            }
        },
        {
            sequelize,
            modelName: 'cashless_shift_log',
            underscored: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    );
    return CashlessShiftLog;
};

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ShiftLogs extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
    }

    ShiftLogs.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            cashier_code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            start_time: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            end_time: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            initial_balance: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
            total_sales: {
                type: DataTypes.DECIMAL,
                defaultValue: 0,
                allowNull: false,
            },
            cash: {
                type: DataTypes.DECIMAL,
                defaultValue: 0,
                allowNull: false,
            },
            cashless: {
                type: DataTypes.DECIMAL,
                defaultValue: 0,
                allowNull: false,
            },  
            closing_balance: {
                type: DataTypes.DECIMAL,
                defaultValue: 0,
                allowNull: false,
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'shift_log',
            underscored: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    );
    return ShiftLogs;
};

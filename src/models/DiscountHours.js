const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class DiscountHours extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    DiscountHours.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            discount_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            day: {
                type: DataTypes.STRING,
				allowNull: false,
			},
            start_hour: {
                type: DataTypes.DECIMAL,
				allowNull: false,
			},
            end_hour: {
                type: DataTypes.DECIMAL,
				allowNull: false,
			}
        },
        {
            sequelize,
            modelName: 'discount_hour',
            underscored: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at'
        },
    );
    return DiscountHours;
};

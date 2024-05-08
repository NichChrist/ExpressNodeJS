const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OutletProductState extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            OutletProductState.belongsTo(models.outlet_product, 
                { foreignKey: 'outlet_product_id' 
            });
        }
    }

    OutletProductState.init(
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
			day: {
                type: DataTypes.STRING,
				allowNull:false,
			},
			is_custom: {
                type: DataTypes.BOOLEAN,
				allowNull: false,
			},
			start_time: {
                type: DataTypes.TIME,
				allowNull: false,
			},
			end_time: {
                type: DataTypes.TIME,
				allowNull: false,
			}
        },
        {
            sequelize,
            modelName: 'outlet_product_state',
            underscored: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    );
    return OutletProductState;
};
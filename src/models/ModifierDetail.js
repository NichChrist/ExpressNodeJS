const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ModifierDetail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            
        }
    }

    ModifierDetail.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
			modifier_id: {
				type: DataTypes.UUID,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull:false,
			},
			price: {
				type: DataTypes.DECIMAL,
				allowNull: false,
			}        
        },
        {
            sequelize,
            modelName: 'modifier_detail',
            underscored: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    );
    return ModifierDetail;
};

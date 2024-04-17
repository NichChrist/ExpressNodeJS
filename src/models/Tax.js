const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Tax extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Tax.belongsToMany(models.outlet, {
                through: 'outlet_tax',
                foreignKey: 'tax_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });
        }
    }

    Tax.init(
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
			amount: {
                type: DataTypes.DECIMAL,
				allowNull: false,
			},
            description: {
                type: DataTypes.TEXT,
				allowNull: true,
			},
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            }
        },
        {
            sequelize,
            modelName: 'tax',
            underscored: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at'
        },
    );
    return Tax;
};

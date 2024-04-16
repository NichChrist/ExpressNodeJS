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
            code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            quota: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            start_date: {
                type: DataTypes.DATE,
				allowNull: false,
			},
            end_date: {
                type: DataTypes.DATE,
				allowNull: true,
			},
            minimum_ammount: {
                type: DataTypes.DECIMAL,
				allowNull: false,
			},
            discount_ammount: {
                type: DataTypes.DECIMAL,
				allowNull: false,
			},
            discount_ammount_cap: {
                type: DataTypes.DECIMAL,
				allowNull: true,
			},
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false,
            },
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

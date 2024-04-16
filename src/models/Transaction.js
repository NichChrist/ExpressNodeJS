const { Model, Transaction } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Transaction extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here  
            
        }
    }

    Transaction.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            outlet_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            space_id: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            handled_by: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            payment_method: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            invoice: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            discount_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            total: {
                type: DataTypes.DECIMAL,
				allowNull: false,
			},
            discounted_amount: {
				allowNull: true,
				type: DataTypes.DECIMAL,
			},
            taxed_amount: {
                type: DataTypes.DECIMAL,
				allowNull: true,
			},
            grand_total: {
                type: DataTypes.DECIMAL,
				allowNull: false,
			},
			created_at: {
                type: DataTypes.DATE,
				allowNull: false,
			},
			updated_at: {
                type: DataTypes.DATE,
				allowNull: false,
			},
			deleted_at: {
                type: DataTypes.DATE,
				allowNull: true,
			}
        },
        {
            scopes: {
                withoutTimestamp: {
                    attributes: { exclude: ['created_at', 'updated_at', 'deleted_at'] },
                },
            },
            sequelize,
            modelName: 'transaction',
            underscored: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    );
    return Transaction;
};

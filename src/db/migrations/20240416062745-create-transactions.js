module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('transactions', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				unique: true,
			},
            outlet_id: {
                allowNull: false,
                type: Sequelize.UUID,
				references: { model: 'outlets', key: 'id' },
            },
            space_id: {
                allowNull: true,
                type: Sequelize.UUID,
				references: { model: 'spaces', key: 'id' },
            },
            handled_by: {
                allowNull: false,
                type: Sequelize.UUID,
				references: { model: 'users', key: 'id' },
            },
            payment_method: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            invoice: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            status: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            discount_code: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            total: {
				allowNull: false,
				type: Sequelize.DECIMAL,
			},
            discounted_amount: {
				allowNull: true,
				type: Sequelize.DECIMAL,
			},
            taxed_amount: {
				allowNull: true,
				type: Sequelize.DECIMAL,
			},
            grand_total: {
				allowNull: false,
				type: Sequelize.DECIMAL,
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			deleted_at: {
				allowNull: true,
				type: Sequelize.DATE,
			}
		});
	},

  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('transactions');
  },
};

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('shift_logs', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				unique: true,
			},
			user_id: {
                allowNull: false,
                type: Sequelize.UUID,
                references: { model: 'users', key: 'id' },
            },
            cashier_code: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            start_time: {
				allowNull: false,
				type: Sequelize.DATE,
			},
            end_time: {
				allowNull: true,
				type: Sequelize.DATE,
			},
			initial_balance: {
				allowNull: false,
				type: Sequelize.DECIMAL,
			},
            total_sales: {
				allowNull: false,
				type: Sequelize.DECIMAL,
			},
            cash: {
				allowNull: false,
				type: Sequelize.DECIMAL,
			},  
            cashless: {
				allowNull: false,
				type: Sequelize.DECIMAL,
			},
            closing_balance: {
				allowNull: false,
				type: Sequelize.DECIMAL,
			},
            status: {
				allowNull: false,
				type: Sequelize.BOOLEAN,
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
      await queryInterface.dropTable('shift_logs');
  },
};

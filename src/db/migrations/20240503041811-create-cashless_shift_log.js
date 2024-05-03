module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('cashless_shift_log', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				unique: true,
			},
			shift_log_id: {
				allowNull: false,
				type: Sequelize.UUID,
				references: { model: 'shift_logs', key: 'id' },
			},
			cashless_type: {
				allowNull:false,
				type: Sequelize.STRING,
			},
			price: {
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
				type: Sequelize.DATE,
			},
		});
	},
  
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('cashless_shift_log');
	},
  };
  
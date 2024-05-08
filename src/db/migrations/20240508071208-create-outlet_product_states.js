module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('outlet_product_states', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				unique: true,
			},
			shift_log_id: {
				allowNull: false,
				type: Sequelize.UUID,
				references: { model: 'outlet_products', key: 'id' },
			},
			day: {
				allowNull:false,
				type: Sequelize.STRING,
			},
			is_custom: {
				allowNull: false,
				type: Sequelize.BOOLEAN,
			},
			start_time: {
				allowNull: false,
				type: Sequelize.TIME,
			},
			end_time: {
				allowNull: false,
				type: Sequelize.TIME,
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
		await queryInterface.dropTable('outlet_product_states');
	},
  };
  
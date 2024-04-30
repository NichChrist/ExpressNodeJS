module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('modifier_details', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				unique: true,
			},
			modifier_id: {
				allowNull: false,
				type: Sequelize.UUID,
				references: { model: 'modifiers', key: 'id' },
			},
			name : {
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
		await queryInterface.dropTable('modifier_details');
	},
  };
  
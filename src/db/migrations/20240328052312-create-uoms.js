module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('uoms', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				unique: true,
			},
			name: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			metric_code: {
				allowNull: true,
				type: Sequelize.STRING,
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
      await queryInterface.dropTable('uoms');
  },
};

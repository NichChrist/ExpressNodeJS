module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('spaces', {
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
			capacity: {
				allowNull: false,
				type: Sequelize.INTEGER,
			},
            description: {
				allowNull: true,
                type: Sequelize.TEXT,
			},
            status: {
				allowNull: false,
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
      await queryInterface.dropTable('spaces');
  },
};

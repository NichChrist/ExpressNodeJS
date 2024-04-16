const { allow } = require("joi");

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('taxes', {
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
			amount: {
				allowNull: false,
				type: Sequelize.DECIMAL,
			},
            description: {
				allowNull: true,
                type: Sequelize.TEXT,
			},
            is_active: {
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
      await queryInterface.dropTable('taxes');
  },
};

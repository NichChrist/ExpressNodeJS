const { allow } = require("joi");

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('discount_hours', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				unique: true,
			},
            discount_id: {
                allowNull: false,
                type: Sequelize.UUID,
				references: { model: 'discounts', key: 'id' },
            },
            day: {
				allowNull: false,
                type: Sequelize.STRING,
			},
            start_hour: {
				allowNull: false,
				type: Sequelize.DECIMAL,
			},
            end_hour: {
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
      await queryInterface.dropTable('discount_hours');
  },
};

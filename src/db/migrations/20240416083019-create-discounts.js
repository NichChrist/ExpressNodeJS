const { allow } = require("joi");

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('discounts', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				unique: true,
			},
            code: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            description: {
				allowNull: true,
                type: Sequelize.TEXT,
			},
            type: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            quota: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },
            start_date: {
				allowNull: false,
				type: Sequelize.DATE,
			},
            end_date: {
				allowNull: true,
				type: Sequelize.DATE,
			},
            minimum_amount: {
				allowNull: false,
				type: Sequelize.DECIMAL,
			},
            discount_amount: {
				allowNull: false,
				type: Sequelize.DECIMAL,
			},
            discount_amount_cap: {
				allowNull: true,
				type: Sequelize.DECIMAL,
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
      await queryInterface.dropTable('discounts');
  },
};

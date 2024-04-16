module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('transaction_details', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				unique: true,
			},
            transaction_id: {
                allowNull: false,
                type: Sequelize.UUID,
				references: { model: 'transactions', key: 'id' },
            },
            product_name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            quantity: {
                allowNull: false,
                type: Sequelize.INTEGER,
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
				allowNull: true,
				type: Sequelize.DATE,
			}
		});
	},

  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('transaction_details');
  },
};

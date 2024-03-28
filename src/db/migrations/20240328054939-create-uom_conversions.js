module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('uom_conversions', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				unique: true,
			},
			uoms_from_id: {
                allowNull: false,
                type: Sequelize.UUID,
                references: { model: 'uoms', key: 'id' },
            },
			uoms_to_id: {
                allowNull: false,
                type: Sequelize.UUID,
                references: { model: 'uoms', key: 'id' },
            },
			multiplier: {
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
      await queryInterface.dropTable('uom_conversions');
  },
};

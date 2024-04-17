module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('ingredient_uoms', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				unique: true,
			},
            ingredient_id: {
                allowNull: false,
                type: Sequelize.UUID,
                references: { model: 'ingredients', key: 'id' },
            },
            uom_id: {
                allowNull: false,
                type: Sequelize.UUID,
                references: { model: 'uoms', key: 'id' },
            },
			is_default: {
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
                type: Sequelize.DATE,
            },
        });
    },
  
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('ingredient_uoms');
    },
  };
  
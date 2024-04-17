module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('recipes', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				unique: true,
			},
            product_id: {
                allowNull: false,
                type: Sequelize.UUID,
                references: { model: 'products', key: 'id' },
            },
            ingredient_id: {
                allowNull: false,
                type: Sequelize.UUID,
                references: { model: 'ingredients', key: 'id' },
            },
			quantity: {
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
        await queryInterface.dropTable('recipes');
    },
  };
  
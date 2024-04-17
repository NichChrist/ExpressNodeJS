module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('outlet_products', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				unique: true,
			},
            outlet_id: {
                allowNull: false,
                type: Sequelize.UUID,
                references: { model: 'outlets', key: 'id' },
            },
            product_id: {
                allowNull: false,
                type: Sequelize.UUID,
                references: { model: 'products', key: 'id' },
            },
			stock: {
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
        await queryInterface.dropTable('outlet_products');
    },
  };
  
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('product_uoms', {
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
            uom_id: {
                allowNull: false,
                type: Sequelize.UUID,
                references: { model: 'uoms', key: 'id' },
            },
			is_default: {
				allowNull: true,
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
        await queryInterface.dropTable('product_uoms');
    },
  };
  
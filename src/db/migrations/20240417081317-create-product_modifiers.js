module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('product_modifiers', {
            product_id: {
                allowNull: false,
                type: Sequelize.UUID,
                references: { model: 'products', key: 'id' },
            },
            modifier_id: {
                allowNull: false,
                type: Sequelize.UUID,
                references: { model: 'modifiers', key: 'id' },
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
        await queryInterface.dropTable('product_modifiers');
    },
  };
  
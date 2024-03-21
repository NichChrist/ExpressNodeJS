module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('user_products', {
            user_id: {
                type: Sequelize.UUID,
                references: { model: 'users', key: 'id' }
            },
            product_id: {
                type: Sequelize.UUID,
                references: { model: 'products', key: 'id' }
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
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('user_products');
    },
};

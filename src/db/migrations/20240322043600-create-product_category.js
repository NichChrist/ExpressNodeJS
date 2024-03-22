module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('product_categories', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                unique: true,
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
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
        await queryInterface.dropTable('product_categories');
    },
};

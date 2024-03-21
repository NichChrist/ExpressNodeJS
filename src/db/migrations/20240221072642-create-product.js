module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('products', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.DataTypes.UUID,
            },
            name: {
                type: Sequelize.STRING,
            },
            description: {
                type: Sequelize.TEXT,
            },
            code: {
                type: Sequelize.STRING,
                unique: true
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
        await queryInterface.dropTable('products');
    },
};

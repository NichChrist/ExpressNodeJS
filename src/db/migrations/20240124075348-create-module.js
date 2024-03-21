module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('modules', {
            id: {
                allowNull: false,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV1,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
            },
            is_shown: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
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
        await queryInterface.dropTable('modules');
    },
};

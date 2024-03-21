module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('actions', {
            id: {
                allowNull: false,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV1,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
            },
            code: {
                type: Sequelize.STRING,
            },
            is_custom: {
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
        await queryInterface.dropTable('actions');
    },
};

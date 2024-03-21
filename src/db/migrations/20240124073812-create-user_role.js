module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('user_roles', {
            user_id: {
                allowNull: false,
                type: Sequelize.UUID,
                references: { model: 'users', key: 'id' },
            },
            role_id: {
                allowNull: false,
                type: Sequelize.UUID,
                references: { model: 'roles', key: 'id' },
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
        await queryInterface.dropTable('user_roles');
    },
};

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('role_permissions', {
            role_id: {
                type: Sequelize.UUID,
                references: { model: 'roles', key: 'id' },
            },
            permission_id: {
                type: Sequelize.UUID,
                references: { model: 'permissions', key: 'id' },
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
        await queryInterface.dropTable('role_permissions');
    },
};

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('permissions', {
            id: {
                allowNull: false,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV1,
                primaryKey: true,
            },
            module_id: {
                type: Sequelize.UUID,
                references: { model: 'modules', key: 'id' },
            },
            action_id: {
                type: Sequelize.UUID,
                references: { model: 'actions', key: 'id' },
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
        await queryInterface.dropTable('permissions');
    },
};

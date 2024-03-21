module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('users', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                primaryKey: true,
                unique: true,
            },
            username: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            password: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            is_active: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
            },
            is_pwd_resetted: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
            },
            parent_id: {
                type: Sequelize.UUID,
                references: { model: 'users', key: 'id' },
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
        await queryInterface.dropTable('users');
    },
};

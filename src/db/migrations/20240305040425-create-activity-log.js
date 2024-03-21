module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('activity_logs', {
            id: {
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.DataTypes.UUIDV1,
                type: Sequelize.DataTypes.UUID,
            },
            action: {
                allowNull: false,
                type: Sequelize.DataTypes.ENUM,
                values: ['create', 'update', 'delete'],
            },
            table: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            target_id: {
                allowNull: false,
                type: Sequelize.UUID,
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
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('ActivityLogs');
    },
};

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('subdistricts', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                unique: true,
            },
            province_id: {
                allowNull: false,
                type: Sequelize.UUID,
                references: { model: 'districts', key: 'id' },
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
			postal_code: {
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
        await queryInterface.dropTable('subdistricts');
    },
};

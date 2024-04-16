module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('outlet_discounts', {
            outlet_id: {
                allowNull: false,
                type: Sequelize.UUID,
                references: { model: 'outlets', key: 'id' },
            },
            discount_id: {
                allowNull: false,
                type: Sequelize.UUID,
                references: { model: 'discounts', key: 'id' },
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
        await queryInterface.dropTable('outlet_discounts');
    },
};

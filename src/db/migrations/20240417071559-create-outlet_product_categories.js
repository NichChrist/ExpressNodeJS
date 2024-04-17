module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('outlet_product_categories', {
          outlet_id: {
              allowNull: false,
              type: Sequelize.UUID,
              references: { model: 'outlets', key: 'id' },
          },
          product_category_id: {
              allowNull: false,
              type: Sequelize.UUID,
              references: { model: 'product_categories', key: 'id' },
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
      await queryInterface.dropTable('outlet_product_categories');
  },
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'outlet_id', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'outlets',
        key: 'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'outlet_id');
  }
};
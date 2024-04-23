module.exports = {
	up: async (queryInterface, Sequelize) => {
	  return queryInterface.addColumn('outlet_products', 'is_active', {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	  })
	},
  
	down: async (queryInterface, Sequelize) => {
	  return queryInterface.removeColumn('outlet_products', 'is_active');
	}
  };
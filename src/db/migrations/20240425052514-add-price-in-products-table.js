module.exports = {
	up: async (queryInterface, Sequelize) => {
	  return queryInterface.addColumn('products', 'price', {
		type: Sequelize.DECIMAL,
		allowNull: false
	  })
	},
  
	down: async (queryInterface, Sequelize) => {
	  return queryInterface.removeColumn('products', 'price');
	}
  };
module.exports = {
	up: async (queryInterface, Sequelize) => {
	  return queryInterface.addColumn('products', 'sku', {
		type: Sequelize.STRING,
		allowNull: false,
        unique: true,
	  })
	},
  
	down: async (queryInterface, Sequelize) => {
	  return queryInterface.removeColumn('products', 'sku');
	}
  };
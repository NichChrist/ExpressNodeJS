module.exports = {
	up: async (queryInterface, Sequelize) => {
	  return queryInterface.addColumn('products', 'picture', {
		type: Sequelize.UUID,
		references: {
		  model: 'files',
		  key: 'id'
		},
		unique: true
	  })
	},
  
	down: async (queryInterface, Sequelize) => {
	  return queryInterface.removeColumn('products', 'picture');
	}
  };
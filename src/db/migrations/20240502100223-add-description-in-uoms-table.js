module.exports = {
	up: async (queryInterface, Sequelize) => {
	  return queryInterface.addColumn('uoms', 'description', {
		type: Sequelize.TEXT,
		allowNull: true,
	  })
	},
  
	down: async (queryInterface, Sequelize) => {
	  return queryInterface.removeColumn('uoms', 'description');
	}
  };
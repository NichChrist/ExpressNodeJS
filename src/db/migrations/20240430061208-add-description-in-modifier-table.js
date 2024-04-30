module.exports = {
	up: async (queryInterface, Sequelize) => {
	  return queryInterface.addColumn('modifiers', 'description', {
		type: Sequelize.TEXT,
		allowNull: true,
	  })
	},
  
	down: async (queryInterface, Sequelize) => {
	  return queryInterface.removeColumn('modifiers', 'description');
	}
  };
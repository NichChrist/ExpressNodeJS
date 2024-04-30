module.exports = {
	up: async (queryInterface, Sequelize) => {
	  return queryInterface.addColumn('modifiers', 'option_type', {
		type: Sequelize.STRING,
		allowNull: false,
	  })
	},
  
	down: async (queryInterface, Sequelize) => {
	  return queryInterface.removeColumn('modifiers', 'option_type');
	}
  };
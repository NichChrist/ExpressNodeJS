module.exports = {
	up: async (queryInterface, Sequelize) => {
	  return queryInterface.addColumn('outlets', 'pin_code', {
		type: Sequelize.STRING,
        allowNull: true,
	  })
	},
  
	down: async (queryInterface, Sequelize) => {
	  return queryInterface.removeColumn('outlets', 'pin_code');
	}
  };
module.exports = {
	up: async (queryInterface, Sequelize) => {
	  return queryInterface.removeColumn('shift_logs', 'cashless')
	},
  
	down: async (queryInterface, Sequelize) => {
	  return queryInterface.addColumn('shift_logs', 'cashless', {
		allowNull: false,
		type: Sequelize.DECIMAL,
	  });
	}
  };
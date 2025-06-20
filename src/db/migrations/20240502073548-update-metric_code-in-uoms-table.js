module.exports = {
	up: async (queryInterface, Sequelize) => {
	  return queryInterface.changeColumn('uoms', 'metric_code', {
		allowNull: false,
		type: Sequelize.STRING,
	  })
	},
  
	down: async (queryInterface, Sequelize) => {
	  return queryInterface.changeColumn('uoms', 'metric_code', {
		allowNull: true,
		type: Sequelize.STRING,
	  });
	},
  };
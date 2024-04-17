module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('files', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				unique: true,
			},
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            mime_type: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            file_path: {
				allowNull: false,
                type: Sequelize.TEXT,
			},
            is_uploaded: {
                allowNull: false,
				type: Sequelize.BOOLEAN,
            },	
            is_resized: {
                allowNull: true,
				type: Sequelize.BOOLEAN,
            },	
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			deleted_at: {
				allowNull: true,
				type: Sequelize.DATE,
			}
		});
	},

  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('files');
  },
};

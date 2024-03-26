module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('outlets', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                unique: true,
            },
			business_type_id: {
                allowNull: false,
                type: Sequelize.UUID,
				references: { model: 'business_types', key: 'id' },
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
			code: {
                allowNull: true,
                type: Sequelize.STRING,
            },
			description: {
				allowNull: true,
                type: Sequelize.TEXT,
			},
			address: {
				allowNull: true,
                type: Sequelize.TEXT,
			},
			parent_id: {
                allowNull: true,
                type: Sequelize.UUID,
				references: { model: 'outlets', key: 'id' },
            },
			subdistrict_id: {
                allowNull: true,
                type: Sequelize.UUID,
				references: { model: 'subdistricts', key: 'id' },
            },
			postal_code: {
                allowNull: true,
                type: Sequelize.STRING,
            },
			phone: {
                allowNull: false,
                type: Sequelize.STRING,
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
        await queryInterface.dropTable('outlets');
    },
};

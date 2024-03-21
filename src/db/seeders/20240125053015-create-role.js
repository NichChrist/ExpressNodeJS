const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('roles', [
            {
                id: uuidv4(),
                name: 'superadmin',
                level: 1,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
            },
            {
                id: uuidv4(),
                name: 'owner',
                level: 2,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
            },
            {
                id: uuidv4(),
                name: 'supervisor',
                level: 3,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
            },
            {
                id: uuidv4(),
                name: 'crew',
                level: 4,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('roles', null, {});
    },
};

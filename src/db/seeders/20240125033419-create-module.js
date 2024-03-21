const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('modules', [
            {
                id: uuidv4(),
                name: 'user',
                is_shown: true,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
            },
            {
                id: uuidv4(),
                name: 'role',
                is_shown: true,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('modules', null, {});
    },
};

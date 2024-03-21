const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('actions', [
            {
                id: uuidv4(),
                name: 'create',
                code: 'create',
                is_custom: false,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
            },
            {
                id: uuidv4(),
                name: 'read',
                code: 'read',
                is_custom: false,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
            },
            {
                id: uuidv4(),
                name: 'update',
                code: 'update',
                is_custom: false,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
            },
            {
                id: uuidv4(),
                name: 'delete',
                code: 'delete',
                is_custom: false,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
            },
            {
                id: uuidv4(),
                name: 'reset password',
                code: 'reset_password',
                is_custom: false,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
            },
            {
                id: uuidv4(),
                name: 'change password',
                code: 'change_password',
                is_custom: false,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('actions', null, {});
    },
};

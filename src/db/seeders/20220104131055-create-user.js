const bcrypt = require('bcryptjs');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('users', [
            {
                id: Sequelize.literal('gen_random_uuid()'),
                first_name: 'John',
                last_name: 'Doe',
                email: 'user@example.com',
                is_active: true,
                password: bcrypt.hashSync('Passw0rd', 8),
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('users', null, {});
    },
};

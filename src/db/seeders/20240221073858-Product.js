const { user: User } = require('../../models');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const users = await User.findAll({
            attributes: ['id'],
        });

        return queryInterface.bulkInsert('products', [
            {
                id: Sequelize.literal('gen_random_uuid()'),
                name: 'lipsum',
                description:
                    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
                code: 'a1b2c',
                // user_id: users[Math.floor(Math.random() * users.length)].id,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('products', null, {});
    },
};

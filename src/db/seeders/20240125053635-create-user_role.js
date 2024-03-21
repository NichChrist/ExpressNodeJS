const { user: User, role: Role } = require('../../models');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const users = await User.findAll({
            attributes: ['id'],
        });

        const roles = await Role.findAll({
            attributes: ['id'],
        });

        return queryInterface.bulkInsert('user_roles', [
            {
                user_id: users[0].id,
                role_id: roles[0].id,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('user_roles', null, {});
    },
};

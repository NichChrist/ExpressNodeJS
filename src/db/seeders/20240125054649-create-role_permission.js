const { role: Role, permission: Permission } = require('../../models');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const roles = await Role.findAll({
            attributes: ['id'],
            where: {
                deleted_at: null,
            },
        });

        const permissions = await Permission.findAll({
            attributes: ['id'],
            where: {
                deleted_at: null,
            },
        });

        const data = [];

        /* Assign all permissions to roles 'superadmin' and 'owner'
         * Note: Customize based on your specific requirements
         */
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < permissions.length; j++) {
                data.push({
                    role_id: roles[i].id,
                    permission_id: permissions[j].id,
                    created_at: new Date(),
                    updated_at: new Date(),
                    deleted_at: null,
                });
            }
        }
        return queryInterface.bulkInsert('role_permissions', data);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('role_permissions', null, {});
    },
};

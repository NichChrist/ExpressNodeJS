const { v4: uuidv4 } = require('uuid');
const { module: Module, action: Action } = require('../../models');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const modules = await Module.findAll({
            attributes: ['id', 'name'],
            where: {
                deleted_at: null,
            },
        });

        const actions = await Action.findAll({
            attributes: ['id'],
            where: {
                deleted_at: null,
            },
        });

        const data = [];

        for (let i = 0; i < modules.length; i++) {
            if (modules[i].name === 'user') {
                for (let j = 0; j < actions.length; j++) {
                    data.push({
                        id: uuidv4(),
                        module_id: modules[i].id,
                        action_id: actions[j].id,
                        created_at: new Date(),
                        updated_at: new Date(),
                        deleted_at: null,
                    });
                }
            } else {
                for (let j = 0; j < 4; j++) {
                    data.push({
                        id: uuidv4(),
                        module_id: modules[i].id,
                        action_id: actions[j].id,
                        created_at: new Date(),
                        updated_at: new Date(),
                        deleted_at: null,
                    });
                }
            }
        }

        return queryInterface.bulkInsert('permissions', data);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('permissions', null, {});
    },
};

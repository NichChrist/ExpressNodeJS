const { user: User, product: Product } = require('../../models');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const users = await User.findAll({
            attributes: ['id'],
        });

        const products = await Product.findAll({
            attributes: ['id'],
        });

        return queryInterface.bulkInsert('user_products', [
            {
                user_id: users[Math.floor(Math.random() * users.length)].id,
                product_id: products[Math.floor(Math.random() * products.length)].id,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('user_products', null, {});
    },
};

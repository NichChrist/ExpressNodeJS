const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');


module.exports = {
    up: async (queryInterface, Sequelize) => {
		const Data = [];
		const csvFilePath = path.join(__dirname, '..', 'data', 'Province.csv');
		await new Promise((resolve, reject) => {
			fs.createReadStream(csvFilePath, { encoding: 'utf8' })
			.pipe(csv())
			.on('data', (data) => {
				const province = {
					id: Sequelize.literal('gen_random_uuid()'),
					name: data['provinsi'],	
					created_at: new Date(),
					updated_at: new Date(),
				}
				Data.push(province)
			})
			.on('end', () => {
				resolve();
			})
			.on('error', (e) => {
				reject(e);
			});
		});

		return queryInterface.bulkInsert('provinces', Data);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('provinces', null, {});
    },
};
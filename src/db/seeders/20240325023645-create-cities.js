const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const model = require('../../models');

const {province: Province} =  model;

module.exports = {
    up: async (queryInterface, Sequelize) => {
		const Data = [];
		const csvFilePath = path.join(__dirname, '..', 'data', 'Cities.csv');
		const province = await Province.findAll();
		await new Promise((resolve, reject) => {
			fs.createReadStream(csvFilePath, { encoding: 'utf8' })
			.pipe(csv())
			.on('data', async (data) => {
				try {
					const cityData = data['kota;type;provinsi'].split(';');
					const idParent = province.find((x) => x.name === cityData[2])
					const city = {
						id: Sequelize.literal('gen_random_uuid()'),
						province_id: idParent.id,
						name: cityData[0],
						created_at: new Date(),
						updated_at: new Date(),
					};
					Data.push(city);
					} catch (error) {
						reject(error);
					}
					})
			.on('end', () => {
				resolve();
			})
			.on('error', (e) => {
				reject(e);
			});
		});
		return queryInterface.bulkInsert('cities', Data);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('cities', null, {});
    },
};
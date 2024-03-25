const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const { Transform } = require('stream');
const model = require('../../models');

const {city: City} =  model;

const replaceCommas = new Transform({
	transform(chunk, encoding, callback) {
	  const modifiedChunk = chunk.toString().replace(/,/g, '');
	  callback(null, modifiedChunk);
	}
  });

module.exports = {
    up: async (queryInterface, Sequelize) => {
		const Data = [];
		const csvFilePath = path.join(__dirname, '..', 'data', 'District.csv');
		const city = await City.findAll();
		await new Promise((resolve, reject) => {
			fs.createReadStream(csvFilePath, { encoding: 'utf8' })
			.pipe(replaceCommas)
			.pipe(csv())
			.on('data', async (data) => {
				try {
					const districtData = data['kecamatan;kabupaten'].split(';');
					const idParent = city.find((x) => x.name === districtData[1])

					const district = {
						id: Sequelize.literal('gen_random_uuid()'),
						city_id: idParent.id,
						name: districtData[0],	
						created_at: new Date(),
						updated_at: new Date(),
					};
					Data.push(district);
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
		return queryInterface.bulkInsert('districts', Data);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('districts', null, {});
    },
};
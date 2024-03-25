const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const { Transform } = require('stream');
const model = require('../../models');

const {district: District} =  model;

const replaceCommas = new Transform({
	transform(chunk, encoding, callback) {
	  const modifiedChunk = chunk.toString().replace(/,/g, '');
	  callback(null, modifiedChunk);
	}
  });

module.exports = {
    up: async (queryInterface, Sequelize) => {
		const Data = [];
		const csvFilePath = path.join(__dirname, '..', 'data', 'Subdistrict.csv');
		const district = await District.findAll();
		await new Promise((resolve, reject) => {
			fs.createReadStream(csvFilePath, { encoding: 'utf8' })
			.pipe(replaceCommas)
			.pipe(csv())
			.on('data', async (data) => {
				try {
					const subdistrictData = data['kelurahan;pos_code;kecamatan'].split(';');
					const idParent = district.find((x) => x.name === subdistrictData[2])

					const subdistrict = {
						id: Sequelize.literal('gen_random_uuid()'),
						district_id: idParent.id,
						name: subdistrictData[0],	
            			postal_code: subdistrictData[1],
						created_at: new Date(),
						updated_at: new Date(),
					};
					Data.push(subdistrict);
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
		return queryInterface.bulkInsert('subdistricts', Data);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('subdistricts', null, {});
    },
};
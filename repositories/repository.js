const fs = require('fs');
const crypto = require('crypto');

module.exports = class Repository {
	constructor(filename) {
		// filename is mandatory while constructing a UsersRepository object
		if (!filename) {
			throw new Error('Creating a repository requires a filename');
		}

		this.filename = filename;
		
		// Create a file if none exists
		try {
			fs.accessSync(this.filename);
		  } catch (err) {
			fs.writeFileSync(this.filename, '[]');
		  }
	}

	async create(attributes) {

		attributes.id = this.randomId();
 
		const record = {
			...attributes
		}

		// First get the file details, then append the new attributes to the file (as a new user)
		const records = await this.getAll();
		records.push(record);

		// Write the updated records back to the file 
		await this.writeAll(records);

		return record;
	}

	async getAll() {
		/* // Open the repo file and store contents
		const contents = await fs.promises.readFile(this.filename, {
			encoding: 'utf8'
		});

		// Read contents
		console.log("Contents:", contents);

		// Parse contents
		const data = JSON.parse(contents);

		// Return parsed data
		return data; */

		// Opens repo, reads contents, parses JSON format to object, and returns data
		return JSON.parse(
			await fs.promises.readFile(this.filename, {
				encoding: 'utf8'
			})
		);
	}
	
	async writeAll(records) {
		// Write the updated records to the file 
		await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2), {
			encoding: 'utf8'
		});
	}

	randomId() {
		return crypto.randomBytes(16).toString('hex');
	}

	async getOne(id) {
		const records = await this.getAll();
		return records.find(record => record.id === id );
	}

	async delete(id) {
		const records = await this.getAll();

		const filteredRecords = records.filter(record => record.id !== id);

		await this.writeAll(filteredRecords);
	}

	async update(id, attributes) {
		const records = await this.getAll();

		const record = records.find(record => record.id === id );

		if(!record){
			throw new Error(`Record with id of ${id} was not found`);
		}

		Object.assign(record, attributes); //copies arguments from source array (attributes) to record. Updates records as well (value by reference)

		await this.writeAll(records);
	}

	async getOneBy(filters) {
		const records = await this.getAll();

		for (let record of records){
			let found = true;

			for (let key in filters){
				if(record[key] !== filters[key]){
					found = false
				}
			}

			if (found) {
				return record;
			}
		}
	}
};
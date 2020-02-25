const fs = require('fs');
const crypto = require('crypto');

class UsersRepository {
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
		return JSON.parse(await fs.promises.readFile(this.filename, {
			encoding: 'utf8'
		}));
	}

	async create(attributes) {

		attributes.id = this.randomId();

		// First get the file details, then append the new attributes to the file (as a new user)
		const records = await this.getAll();
		records.push(attributes);

		// Write the updated records back to the file 
		await this.writeAll(records);
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
}


// const test = async () => {
// 	const repo = new UsersRepository('users.json');

// /* 	await repo.create({
// 		email: 'mohit@test.com',
// 		password: 'qwerty'
// 	})

// 	const users = await repo.getAll();
// 	console.log("Users:", users);

// 	const user = await repo.getOne('jnkjn');
// 	console.log("Fetched user:", user); */

// 	/* await repo.update('de1c946731dd29541153cd4f8044a19', {
// 		password: '123456',
// 		age: '25'
// 	}); */

// 	const user = await repo.getOneBy({
// 		/* email: 'mohit@test2.com', */
// 		gendaar: 'g'
// 	})

// 	console.log(user);
// }

// test();

module.exports = new UsersRepository('users.json');
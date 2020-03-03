// const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');


const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
	async create(attributes) {

		attributes.id = this.randomId();

		// create salt
		const salt = crypto.randomBytes(16).toString('hex');

		// create hash
		const hashed = await scrypt(attributes.password, salt, 64);
		// attributes.hash = hashed.toString('hex') + '.' + salt;

		// 
		const record = {
			...attributes,
			password: hashed.toString('hex') + '.' + salt
		}

		// First get the file details, then append the new attributes to the file (as a new user)
		const records = await this.getAll();
		records.push(record);

		// Write the updated records back to the file 
		await this.writeAll(records);

		return record;
	}

	async comparePassword(saved, supplied) {
		// saved password includes salt
		const [ hash, salt ] = saved.split('.');

		const hashedSupplied = await scrypt(supplied, salt, 64); //buffer objecte

		return (hashedSupplied.toString('hex') === hash)
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
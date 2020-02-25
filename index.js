const express = require('express');
const bodyParser = require('body-parser');
const usersRepo = require('./repositories/users');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
	res.send(`
		<div>
			<form method="POST">
				<input type="email" name="email" placeholder="email" id="">
				<input type="password" name="password" placeholder="password" id="">
				<input type="password" name="confirmPassword" placeholder="confirm password" id="">
				<button>Sign Up</button>
			</form>
		</div>
	`);
});

app.post('/', async (req, res) => {
	let { email, password, confirmPassword } = req.body;

	// Check if password = confirmed password
	if (password !== confirmPassword){
		res.send('Password !== confirmed Password');
		return;
	}

	// Check if user already exists with provided email, otherwise show error
	const existingUser = await usersRepo.getOneBy({ email });

	if (existingUser) {
		res.send('User with this email ID already exists');
		return;
	}

	usersRepo.create({
		email,
		password
	});

	res.send('Account created!!!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
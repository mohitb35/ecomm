const express = require('express');
const bodyParser = require('body-parser');
const usersRepo = require('./repositories/users');
const cookieSession = require('cookie-session');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
	keys: ['ansfknwsclwmsn32o32m', 'asijfnweiocj2321w2190']
}));

app.get('/signup', (req, res) => {
	res.send(`
		<div>
			Your ID is ${req.session.userId}
			<form method="POST">
				<input type="email" name="email" placeholder="email" id="">
				<input type="password" name="password" placeholder="password" id="">
				<input type="password" name="confirmPassword" placeholder="confirm password" id="">
				<button>Sign Up</button>
			</form>
		</div>
	`);
});

app.post('/signup', async (req, res) => {
	let { email, password, confirmPassword } = req.body;

	// Check if password = confirmed password
	if (password !== confirmPassword){
		res.send('Password !== confirmed Password');
		return;
	}

	// Check if user already exists with provided email - if true, show error
	const existingUser = await usersRepo.getOneBy({ email });

	if (existingUser) {
		res.send('User with this email ID already exists');
		return;
	}


	// Create user in userRepo
	const user = await usersRepo.create({
		email,
		password
	});

	// Store id of user inside the user's cookie
	req.session.userId = user.id;

	res.send('Account created!!!');
});

app.get('/signout', (req, res) => {
	req.session = null;
	res.send('You are logged out!');
});

app.get('/signin', (req, res) => {
	res.send(`
		<div>
			<form method="POST">
				<input type="email" name="email" placeholder="email" id="">
				<input type="password" name="password" placeholder="password" id="">
				<button>Sign In</button>
			</form>
		</div>
	`);
});

app.post('/signin', async (req, res) => {
	const { email, password } = req.body;

	// Check if user already exists with provided email, otherwise show error
	const existingUser = await usersRepo.getOneBy({ email });

	if (!existingUser) {
		res.send('Please create an account first');
		return;
	}

	const passwordValid = await usersRepo.comparePassword(existingUser.password, password);
	// Check password
	if (!passwordValid){
		res.send('Invalid password');
		return;
	}

	req.session.userId = existingUser.id;
	
	res.send('You are signed in');
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
const express = require('express');

const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const { 
	requireEmail, 
	requirePassword, 
	requirePasswordConfirmation, 
	requireEmailExists, 
	requireValidPasswordForUser 
} = require('./validators');

const { handleErrors } = require('./middlewares');

const router = express.Router();

router.get ('/signup', (req, res) => {
	res.send(signupTemplate({ req }));
});
 
router.post ('/signup', 
	[requireEmail, requirePassword, requirePasswordConfirmation], 
	handleErrors(signupTemplate),
	async (req, res) => {
	let { email, password } = req.body;
	// Create user in userRepo
	const user = await usersRepo.create({ email, password });

	// Store id of user inside the user's cookie
	req.session.userId = user.id;

	res.send('Account created!!!');
});

router.get('/signout', (req, res) => {
	req.session = null;
	res.send('You are logged out!');
});

router.get('/signin', (req, res) => {
	res.send(signinTemplate({}));
});

router.post('/signin', 
	[ requireEmailExists, requireValidPasswordForUser],
	handleErrors(signinTemplate),
	async (req, res) => {
		const { email } = req.body;

		const existingUser = await usersRepo.getOneBy({ email });

		req.session.userId = existingUser.id;
		
		res.send('You are signed in');
});

module.exports = router;
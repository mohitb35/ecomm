const express = require('express');
const { check, validationResult } = require('express-validator');

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

const router = express.Router();

router.get ('/signup', (req, res) => {
	res.send(signupTemplate({ req }));
});
 
router.post ('/signup', 
	[requireEmail, requirePassword, requirePasswordConfirmation], 
	async (req, res) => {
	const errors = validationResult(req); //gets validation Output (result object)
	
	if(!errors.isEmpty()){
		res.send(signupTemplate({ req, errors}));
		return;
	}

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
	[
		requireEmailExists, requireValidPasswordForUser
	],
	async (req, res) => {
		const errors = validationResult(req);
		console.log(errors);
		
		if(!errors.isEmpty()){
			res.send(signinTemplate({ errors }));
			return;
		}

		const { email } = req.body;

		const existingUser = await usersRepo.getOneBy({ email });

		req.session.userId = existingUser.id;
		
		res.send('You are signed in');
});

module.exports = router;
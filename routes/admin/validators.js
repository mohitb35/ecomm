const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
	requireEmail: check('email')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage('Must be a valid email')
		.custom( async (email) => {
			// Check if user already exists with provided email - if true, show error
			const existingUser = await usersRepo.getOneBy({ email });
			if (existingUser) {
				throw new Error('User with this email ID already exists');
			}
		}),
	requirePassword: check('password')
		.trim()
		.isLength({ min: 6, max: 30 })
		.withMessage('Must be between 6 and 30 characters'),
	requirePasswordConfirmation: check('confirmPassword')
		.trim()
		.isLength({ min: 6, max: 30 })
		.withMessage('Must be between 6 and 30 characters')
		.custom( (confirmPassword, { req }) => {
			if(confirmPassword !== req.body.password){
				throw new Error('Passwords do not match');
			} else {
				return true;
			}
		}),
	requireEmailExists: check('email')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage('Must be a valid email')
		.custom(async (email) => {
			// Check if user already exists with provided email, otherwise show error
			const existingUser = await usersRepo.getOneBy({ email });

			if (!existingUser) {
				throw new Error('Please create an account');
			}
		}),
	requireValidPasswordForUser: check('password')
		.trim()
		.not()
		.isEmpty()
		.withMessage('Please enter a password')
		.custom(async (password, { req }) => {
			const existingUser = await usersRepo.getOneBy({ email: req.body.email });
			if (!existingUser) {
				throw new Error('Invalid password');
			}

			const passwordValid = await usersRepo.comparePassword(existingUser.password, password);

			// Check password
			if (!passwordValid){
				throw new Error('Invalid password');
			}
		})
}
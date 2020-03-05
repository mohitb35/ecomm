const { validationResult } = require('express-validator');


// To create middleware, need to return a function
module.exports = {
	handleErrors (templateFunction) {

		return (req, res, next) => {
			const errors = validationResult(req); 
			//processes the errors and returns a Result Object
			
			if(!errors.isEmpty()) {
				res.send(templateFunction({ errors }));
				return;
			}
		
			next();
		}
	},
	requireAuth(req, res, next) {
		if(!req.session.userId) {
			res.redirect('/signin');
			return;
		}
		
		next();
	}
}
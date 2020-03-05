const { validationResult } = require('express-validator');


// To create middleware, need to return a function
module.exports = {
	handleErrors (templateFunction, dataCb = null) {

		return async (req, res, next) => {
			const errors = validationResult(req); 
			//processes the errors and returns a Result Object

			if(!errors.isEmpty()) {

				let data = {};
				if (dataCb) {
					data = await dataCb(req);
				}

				res.send(templateFunction({ errors, ...data }));
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
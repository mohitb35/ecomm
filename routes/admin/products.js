const express = require('express');
const { check, validationResult } = require('express-validator');

const productsRepo = require('../../repositories/products');
const createProductTemplate = require('../../views/admin/products/new');

const { 
	requireTitle, 
	requirePrice 
} = require('./validators');

const router = express.Router();

/* Routes */
// Admin product listy
router.get('/admin/products', (req, res) => {
	res.send('1');
});

// Add product form
router.get('/admin/products/new', (req, res) => {
	res.send(createProductTemplate({}));
});

router.post('/admin/products/new', 
	[requireTitle, requirePrice],
	(req, res) => {
		const errors = validationResult(req);

		if(!errors.isEmpty()){
			res.send(createProductTemplate({ errors }));
			return;
		}

		res.send('submitted');
	}
)

module.exports = router;
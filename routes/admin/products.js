const express = require('express');

const router = express.Router();

const productsRepo = require('../../repositories/products');
const createProductTemplate = require('../../views/admin/products/new');

/* Routes */
// Admin product listy
router.get('/admin/products', (req, res) => {
	res.send('1');
});

// Add product form
router.get('/admin/products/new', (req, res) => {
	res.send(createProductTemplate({}));
});

module.exports = router;
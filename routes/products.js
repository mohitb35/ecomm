const express = require('express');

const productsRepo = require('../repositories/products');
const productListTemplate = require('../views/products/index');

const router = express.Router();

router.get('/', async (req, res) => {
	const products = await productsRepo.getAll();
	res.send(productListTemplate({ products }));
})

module.exports = router;
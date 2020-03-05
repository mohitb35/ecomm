const express = require('express');
const multer = require('multer');

const productsRepo = require('../../repositories/products');
const createProductTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');

const { 
	requireTitle, 
	requirePrice 
} = require('./validators');
const { handleErrors } = require('./middlewares');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/* Routes */
// Admin product list route
router.get('/admin/products', async (req, res) => {
	// Get products JSON array from products.json
	const products = await productsRepo.getAll();

	res.send(productsIndexTemplate({ products }));
});

// Add product form
router.get('/admin/products/new', (req, res) => {
	res.send(createProductTemplate({}));
});

router.post('/admin/products/new', 
	upload.single('image'),
	// Need this after the middleware above (otherwise req.body does not exist, as bodyParser does not parse multipart form data)
	[requireTitle, requirePrice], 
	handleErrors(createProductTemplate),
	async (req, res) => {
		const image =  req.file.buffer.toString('base64');
		const { title, price } = req.body;

		await productsRepo.create({	title, price, image });

		res.redirect('/admin/products');
	}
)

module.exports = router;
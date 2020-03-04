const express = require('express');
const multer = require('multer');

const productsRepo = require('../../repositories/products');
const createProductTemplate = require('../../views/admin/products/new');

const { 
	requireTitle, 
	requirePrice 
} = require('./validators');
const { handleErrors } = require('./middlewares');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

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
	upload.single('image'),
	// Need this after the middleware above (otherwise req.body does not exist, as bodyParser does not parse multipart form data)
	[requireTitle, requirePrice], 
	handleErrors(createProductTemplate),
	async (req, res) => {
		const image =  req.file.buffer.toString('base64');
		const { title, price } = req.body;

		await productsRepo.create({	title, price, image });

		res.send('submitted');
	}
)

module.exports = router;
const express = require('express');
const multer = require('multer');

const productsRepo = require('../../repositories/products');
const createProductTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');
const productsEditTemplate = require('../../views/admin/products/edit');

const { 
	requireTitle, 
	requirePrice 
} = require('./validators');
const { handleErrors,requireAuth } = require('./middlewares');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/* Routes */
// Admin product list route
router.get('/admin/products', 
	requireAuth,
	async (req, res) => {
		// Get products JSON array from products.json
		const products = await productsRepo.getAll();
		res.send(productsIndexTemplate({ products }));
	}
);

// Add product form
router.get('/admin/products/new', 
	requireAuth,
	(req, res) => {
		res.send(createProductTemplate({}));
	}
);

router.post('/admin/products/new',
	requireAuth,
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
);

router.get('/admin/products/:id/edit',
	requireAuth,
	async (req, res) => {
		const productId = req.params.id;
		const product = await productsRepo.getOne(productId);
		
		if (!product){
			res.send('Product not found');
			return;
		}
		
		res.send(productsEditTemplate({ product }));
	}
);

router.post('/admin/products/:id/edit', 
	requireAuth,
	upload.single('image'),
	[requireTitle, requirePrice],
	handleErrors(productsEditTemplate, async(req) => {
		const product = await productsRepo.getOne(req.params.id);
		return { product };
	}),
	async (req, res) => {
		const productId = req.params.id;
		const changes = req.body;

		if(req.file) {
			changes.image = req.file.buffer.toString('base64');
		}

		try {
			await productsRepo.update(productId, changes);
		} catch (err) {
			res.send('Could not find item');
			return;
		}
				
		res.redirect('/admin/products');
	}
);

router.post('/admin/products/:id/delete',
	requireAuth,
	async (req, res) => {
		const productId = req.params.id;

		try {
			await productsRepo.delete(productId);
		} catch (err) {
			res.send('Could not find item');
			return;
		}

		res.redirect('/admin/products');
	}	
)

module.exports = router;
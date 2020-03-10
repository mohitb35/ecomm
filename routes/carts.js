const express = require('express');

const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');

const router = express.Router();

// Add item to cart route
router.post('/cart/products', async (req, res) => {
	const { cartId } = req.session;
	const { productId } = req.body;

	// In case product does not exist, return with an error
	const product = await productsRepo.getOne(productId);

	if (!product) {
		res.send('Product not found');
		return;
	}

	let cart;
	// Check if cart exists
	if (!cartId) {
		// create cart
		try {
			cart = await cartsRepo.create({ items: []	});
			req.session.cartId = cart.id;
		} catch (err) {
			res.send('Could not create cart');
			return;
		}
	} else {
		// fetch cart from repo
		try {
			cart = await cartsRepo.getOne(cartId);
		} catch (err) {
			res.send('Could not fetch cart info');
			return;
		}
	}

	// Add product to cart, or increment quantity if it is already within the cart
	const existingItem = cart.items.find(item => item.id === productId);
	if (!existingItem){
		cart.items.push({
			id: productId,
			quantity: 1
		})
	} else {
		existingItem.quantity++;
	};

	try {
		await cartsRepo.update(cart.id, {
			items: cart.items
		});
	} catch (err) {
		res.send('could not add item');
	};
	
	res.redirect('/cart');

});

// Show all items in cart route
router.get('/cart', async (req, res) => {
	const { cartId } = req.session;

	let cart;

	// If no cart exists, redirect to product list page
	if (!cartId) {
		res.redirect('/');
		return;
	} else {
		// fetch cart from repo
		try {
			cart = await cartsRepo.getOne(cartId);
		} catch (err) {
			res.send('Could not fetch cart info');
			return;
		}
	}
	
	for (let item of cart.items){
		const product = await productsRepo.getOne(item.id);
		item.product = product;
	}

	res.send(cartShowTemplate({ cart }));

});

// remove item from cart route
router.post('/cart', async (req, res) => {
});

module.exports = router;
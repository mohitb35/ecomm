const layout = require('../layout');

module.exports = ({ products }) => {
	// Converts products array into array of html divs with name, and then joins the array
	const renderedProducts = products.map((product) => {
		return `
			<div>${product.title}</div>
		`;
	}).join('');

	return layout({
		content: `
			<h1 class="title">Products</h1>
			${renderedProducts}
		`
	})
};
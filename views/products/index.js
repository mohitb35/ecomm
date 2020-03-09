// const layout = require('../layout');

module.exports = ({ products }) => {
	// Converts products array into array of html divs with name, and then joins the array
	const renderedProducts = products.map((product) => {
		return `
			<li>${product.title} - ${product.price}</li>
		`;
	}).join('');

	return `
		<ul>
		${renderedProducts}
		</ul>
	`
};
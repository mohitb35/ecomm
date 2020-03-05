const layout = require('../layout');

const { getError } = require('../../helpers');

module.exports = ({ product, errors = {} }) => {
	return layout({ 
		content: `
			<div class="columns is-centered">
				<div class="column is-half">
					<h1 class="subtitle">Edit Product</h1>
					<form method="POST" enctype="multipart/form-data">
						<div class="field">
							<label class="label">Title</label>
							<input required class="input" placeholder="Title" name="title" type="text" value="${product.title}" />
							<p class="help is-danger">${getError(errors, 'title')}</p>
						</div>
						<div class="field">
							<label class="label">Price</label>
							<input required class="input" placeholder="Price" name="price" type="number" step="any" value="${product.price}" />
							<p class="help is-danger">${getError(errors, 'price')}</p>
						</div>
						<div class="field">
							<label class="label">Image</label>            
							<input type="file" name="image" />
						</div>
            			<br />
						<button class="button is-primary">Save Changes</button>
					</form>
				</div>
			</div>
		` 
	});
};
const layout = require('../layout');

const { getError } = require('../../helpers');

module.exports = ({ errors }) => {
	return layout({ 
		content: `
		<div class="container">
			<div class="columns is-centered">
				<div class="column is-one-quarter">
					<form method="POST">
						<h1 class="title">Add Product</h1>
						<div class="field">
							<label class="label">Title</label>
							<input required class="input" placeholder="Title" name="title" type="text"/>
							<p class="help is-danger">${getError(errors, 'title')}</p>
						</div>
						<div class="field">
							<label class="label">Price</label>
							<input required class="input" placeholder="Price" name="price" type="text" />
							<p class="help is-danger">${getError(errors, 'price')}</p>
						</div>
						<input type="file" name="image" id="">
						<button class="button is-primary">Create Product</button>
					</form>
				</div>
			</div>
		</div>
		` 
	});
};
const layout = require('../layout');

const { getError } = require('../../helpers');


module.exports = ({ req, errors }) => {
	return layout({ content: 
		`
			<div class="container">
				<div class="columns is-centered">
					<div class="column is-one-quarter">
						<form method="POST">
							<h1 class="title">Sign Up</h1>
							<div class="field">
								<label class="label">Email</label>
								<input required class="input" type="email" name="email" placeholder="email" id="">
								<p class="help is-danger">${getError(errors, 'email')}</p>
							</div>
							<div class="field">
								<label class="label">Password</label>
								<input required class="input" type="password" name="password" placeholder="password" id="">
								<p class="help is-danger">${getError(errors, 'password')}</p>
							</div>
							<div class="field">
								<label class="label">Confirm Password</label>
								<input required class="input" type="password" name="confirmPassword" placeholder="confirm password" id="">
								<p class="help is-danger">${getError(errors, 'confirmPassword')}</p>
							</div>
							<button>Sign Up</button>
						</form>
					</div>
				</div>
			</div>
		` 
	});
};
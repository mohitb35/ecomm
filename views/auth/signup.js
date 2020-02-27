const layout = require('../layout');

module.exports = ({ req }) => {
	return layout({ content: 
		`
			<div>
				Your ID is ${req.session.userId}
				<form method="POST">
					<input type="email" name="email" placeholder="email" id="">
					<input type="password" name="password" placeholder="password" id="">
					<input type="password" name="confirmPassword" placeholder="confirm password" id="">
					<button>Sign Up</button>
				</form>
			</div>
		` 
	});
};
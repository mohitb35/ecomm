const layout = require('../layout');

module.exports = () => {
	return layout({ 
		content: `
			<div>
				<form method="POST">
					<input type="email" name="email" placeholder="email" id="">
					<input type="password" name="password" placeholder="password" id="">
					<button>Sign In</button>
				</form>
			</div>
		` 
	});
};
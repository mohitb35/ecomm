const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
	res.send(`
		<div>
			<form method="POST">
				<input type="email" name="email" placeholder="email" id="">
				<input type="password" name="password" placeholder="password" id="">
				<input type="password" name="confirmPassword" placeholder="confirm password" id="">
				<button>Sign Up</button>
			</form>
		</div>
	`);
});

app.post('/', (req, res) => {
	console.log(req.body);
	res.send('Account created!!!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
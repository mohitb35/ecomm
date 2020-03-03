const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
	keys: ['ansfknwsclwmsn32o32m', 'asijfnweiocj2321w2190']
}));
app.use(authRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
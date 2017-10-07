var {User} = require('./../models/user');

//middleware to authenticate user
//call the function like this:
// app.get('/users/me', authenticate, (req, res) => {
// 	res.send(req.user);
// });

let authenticate = (req, res, next ) => {
	let token = req.header('x-auth');

	User.findByToken(token).then((user) => {
		if(!user) {
			return Promise.reject();
		}
		req.user = user;
		req.token = token;
		next();
		// res.send(user);
	}).catch((e) => {
		res.status(401).send();
	});
};

module.exports = {authenticate};

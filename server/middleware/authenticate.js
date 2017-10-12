var {User} = require('./../models/user');

//middleware to authenticate user
//call the function like this:
// app.get('/users/me', authenticate, (req, res) => {
// 	res.send(req.user);
// });

//findByToken is a statics method in user model
//it verifies that the token is valid, then returns the user
let authenticate = (req, res, next ) => {
	let token = req.header('x-auth');

	User.findByToken(token).then((user) => {
		if(!user) {
			return Promise.reject();
		}
		//gives us access to the user and the token via the request (req) object when the route is called
		req.user = user;
		req.token = token;
		next();
		// res.send(user);
	}).catch((e) => {
		res.status(401).send();
	});
};

module.exports = {authenticate};

const mongoose = require('mongoose');

//create User model
//email - req. and trim , str, minl 1

//create a new user

let User = mongoose.model('User', {
	email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true //trims whitespace
	}
});

// let newUser = new User({
// 	email: 'adriamooney@yes.com'
// });

// //saves to db, and returns a Promise
// newUser.save().then((doc) => {
// 	console.log('saved user', doc)
// }, (err) => {
// 	console.log('unable to save user', err)
// });

module.exports = {User};
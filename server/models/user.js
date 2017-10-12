const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');



//create User model
//email - req. and trim , str, minl 1

var UserSchema = new mongoose.Schema({

	email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true, //trims whitespace,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email'
		}
	},
	password: {
		type: String,
		require: true,
		minlength: 6
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]

});

UserSchema.methods.toJSON = function() {
	let user = this;
	// console.log('user is ', user);
	let userObject = user.toObject();
	// console.log('userobject is ', userObject);

	return _.pick(userObject, ['_id', 'email']);
};

//this token is generated when user is created
UserSchema.methods.generateAuthToken = function() {
	//don't use arrow function,
	//need this keyword to be bound to the document:
	let user = this;
	let access = 'auth';
	//hash the user id, creating a token
	let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

	//push the token to the tokens array on the user object:
	user.tokens.push({access,token});

	//don't really understand this
	return user.save().then(() => {
		return token;
	});

};

UserSchema.methods.removeToken = function(token) {
	let user = this;
	return user.update({
		$pull: {
			tokens: {token}
		}
	});

};

//statics object creates model methods instead of instance methods
UserSchema.statics.findByToken = function(token) {
	//instance methods get called with the document as this (see, generateAuthToken above)
	//model methods get called with the model as this:
	let User = this;
	let decoded;
	try{
		decoded = jwt.verify(token, 'abc123');
	} catch(e) {
		// return new Promise((resolve, reject) => {
		// 	reject();
		// });
		//simplified, does same as above:
		return Promise.reject();
	}
	// findOne returns a promise, so we return the findOne in order to add chaining,
	//meaning we can add a 'then' call onto findByToken
	return User.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});

	
};

UserSchema.statics.findByCredentials = function(email, password) {
	let User = this;

	//return this so you can chain the promise in server.js
	return User.findOne({email}).then((user) => {
		if(!user) {
			//return a rejected promise, will trigger the catch case when called
			return Promise.reject();
		}

		//bcrypt library doesn't support promises
		//so we can put it inside of a new Promise like this:
		//compare the password argument that was passed in by findByCredentials with the password that comes
		//back from the user with User.findOne  (user.password)
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, res) => {
				if(res) {
					//this will return the user to the 'then' when the promise is called with findByCredentials
					resolve(user);
				}
				else {
					reject();
				}
			});
		});

	})
};

//mongoose middleware, executes before doc is saved to database
UserSchema.pre('save', function(next) {
	var user = this;
	if(user.isModified('password')) {

		//generates a salt and hashes the password with the salt.  then set the user.password to that hash
		//value.  then call next to continue saving the user doc
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			});
		});
		//user.password
		// user.password = hash;
		
	} else {
		next();
	}
});

let User = mongoose.model('User', UserSchema);



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
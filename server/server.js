
require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');

var {Todo} = require('./models/todos');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

const app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

//POST todos
app.post('/todos', authenticate, (req, res) => {
	console.log(req);
	let todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});

	todo.save().then((doc) => {
		res.send(doc)
	}, (e) => {
		res.status(400).send(e);
	});
});

//get todos

app.get('/todos', authenticate, (req, res) => {
	Todo.find({
		_creator: req.user._id
	}).then((todos)=> {
		res.send({todos});
	}, (e) => {
		res.status(400).send(e);
	});
});

//get /todos/1234
app.get('/todos/:id', authenticate, (req,res)=> {
	let id = req.params.id;
	//res.send(req.params);

	if(!ObjectID.isValid(id)) {
		console.log('id is not valid');
		res.status(404).send();
	}
	Todo.findOne({
		_id: id,
		_creator: req.user._id
	}).then((todo)=> {
		if(!todo) {
			res.status(404).send();
		}
		res.send({todo});
		console.log('TodoById', todo);
	}).catch((e) => {
		res.status(400).send(e);
	});

	//valid id using isvalid
	//404 send back empty send
	//findById
	//success
	//if todo send it back
	//if no todo, send 404 with empty body
	//error
	//400 and send empty body
});

app.delete('/todos/:id', authenticate, (req, res) => {
	//get the id
	//validate the id
	//remove todo by id
	//error 400 w/ empty boy
	//success if no doc send 404
	//if doc, send doc w/ 200
	let id = req.params.id;
	//res.send(req.params);

	if(!ObjectID.isValid(id)) {
		console.log('id is not valid');
		res.status(404).send();
	}
	Todo.findOneAndRemove({
		_id: id,
		_creator: req.user._id
	}).then((todo)=> {
		if(!todo) {

			res.status(404).send();
		}
		res.send({todo});
		// console.log('TodoById', todo);
	}).catch((e) => {
		res.status(400).send(e);
	});
});


app.patch('/todos/:id', authenticate, (req, res) => {
	let id = req.params.id;
	// console.log(id);
	//pick properties off of the object that we want users to be able to update
	//using lodash pick
	let body = _.pick(req.body, ['text', 'completed']);

	if(!ObjectID.isValid(id)) {
		console.log('id is not valid');
		res.status(404).send();
	}

	if(_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	}
	else {
		body.completed = false;
		//remove a value from db, just set to null
		body.completedAt = null;
	}
	// console.log(body);
	//update with body object
	Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new:true}).then((todo) => {
		// console.log(todo);
		if(!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e) => {
		res.status(400).send(e);
	});
});

//POST /users
app.post('/users', (req, res) => {
	// console.log(req.body);
	let body = _.pick(req.body, ['email', 'password']);
	let user = new User(body);
	// console.log(user);

	user.save().then(() => {
		//method described in user model
		return user.generateAuthToken();
		
	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((e) => {
		res.status(400).send(e);
	});
});

//GET my user

//authenticate middleware function is second argument
//it finds the user by token, sends 401 if a problem.  otherwise gets the user 
app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});

//POST /users/login {email, password}
app.post('/users/login', (req, res) => {

	let body = _.pick(req.body, ['email', 'password']);

	//findByCredentials is a statics method found in user model
	User.findByCredentials(body.email, body.password).then((user) => {
		// res.send(user);
		//using return here, keeps the chain alive so if there are any errors, then the 400 will be used from the catch below
		//otherwise, send the user with the token in the header
		return user.generateAuthToken().then((token) => {
			res.header('x-auth', token).send(user);
		});
	}).catch((e) => {
		res.status(400).send(e);
	});

});

app.delete('/users/me/token', authenticate, (req, res) => {
	req.user.removeToken(req.token).then(() => {
		res.status(200).send();
	}, () => {
		res.status(400).send();
	})
})

app.listen(port, () => {
	console.log(`started on port ${port}`)
});

module.exports = {app};
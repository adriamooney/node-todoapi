
require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');

var {Todo} = require('./models/todos');
var {User} = require('./models/user');

const app = express();

const port = process.env.PORT;

app.use(bodyParser.json());


app.post('/todos', (req, res) => {
	console.log(req.body);
	let todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc) => {
		res.send(doc)
	}, (e) => {
		res.status(400).send(e);
	});
});

//get todos

app.get('/todos', (req, res) => {
	Todo.find().then((todos)=> {
		res.send({todos});
	}, (e) => {
		res.status(400).send(e);
	});
});

//get /todos/1234
app.get('/todos/:id', (req,res)=> {
	let id = req.params.id;
	//res.send(req.params);

	if(!ObjectID.isValid(id)) {
		console.log('id is not valid');
		res.status(404).send();
	}
	Todo.findById(id).then((todo)=> {
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

app.delete('/todos/:id', (req, res) => {
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
	Todo.findByIdAndRemove(id).then((todo)=> {
		if(!todo) {

			res.status(404).send();
		}
		res.send({todo});
		console.log('TodoById hello', todo);
	}).catch((e) => {
		res.status(400).send(e);
	});
});


app.patch('/todos/:id', (req, res) => {
	let id = req.params.id;
	console.log(id);
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
	Todo.findByIdAndUpdate(id, {$set: body}, {new:true}).then((todo) => {
		// console.log(todo);
		if(!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e) => {
		res.status(400).send(e);
	});
});

app.listen(port, () => {
	console.log(`started on port ${port}`)
});

module.exports = {app};
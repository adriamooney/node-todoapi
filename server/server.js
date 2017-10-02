const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');

var {Todo} = require('./models/todos');
var {User} = require('./models/user');

const app = express();

const port = process.env.PORT || 3000;

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


app.listen(port, () => {
	console.log(`started on port ${port}`)
});

module.exports = {app};
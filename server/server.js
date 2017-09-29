const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');

var {Todo} = require('./models/todos');
var {User} = require('./models/user');

const app = express();

app.use(bodyParser.json());


app.post('/todos', (req, res) => {
	console.log(req.body);
	let todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc) => {
		res.send(doc)
	}, (e) => {
		res.status(400).res.send(e);
	});
});

app.listen(3000, () => {
	console.log('started on port 3000')
});
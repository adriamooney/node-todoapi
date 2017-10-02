const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todos');

//59cd4a29e9458f4a641f07d1

var id = '59d2ac4fcfe385d267f993fa';

if(!ObjectID.isValid(id)) {
	console.log('id is not valid');
}

Todo.find({
	_id: id
}).then((todos)=> {
	console.log('Todos', todos);
});

Todo.findOne({
	_id: id
}).then((todo)=> {
	console.log('Todo', todo);
});

Todo.findById(id).then((todo)=> {
	if(!todo) {
		return console.log('id not found');
	}
	console.log('TodoById', todo);
}).catch((e) => console.log(e));
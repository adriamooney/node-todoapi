
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('./../../models/todos');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
	_id: userOneId,
	email: 'adria@example.com',
	password: 'userOnePass',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
	}]
}, {
	_id: userTwoId,
	email: 'adria@boo.com',
	password: 'userTwoPass',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
	}]
}]

const todos = [{
	text: 'first to do',
	_id: new ObjectID(),
	_creator: userOneId
	},{
	text: 'second todo',
	_id: new ObjectID(),
	completed: true,
	completedAt: 333,
	_creator: userTwoId
}];

const populateTodos = (done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
};

const populateUsers = (done) => {
	User.remove({}).then(() => {
		let userOne = new User(users[0]).save();
		let userTwo = new User(users[1]).save();

		//by returning the Promise.all here, it lets you chain the then below to return 
		//when all promises are done
		return Promise.all([userOne, userTwo])
	}).then(() => done());
}

module.exports = {todos, populateTodos, users, populateUsers};
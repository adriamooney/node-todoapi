const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todos');

const todos = [{
	text: 'first to do',
	_id: new ObjectID()
	},{
	text: 'second todo',
	_id: new ObjectID(),
	completed: true,
	completedAt: 333
}];

beforeEach((done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
});

// beforeEach((done) => {
// 	Todo.remove({}).then(() => done());
// });

describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		let text = 'test todo text';
		request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err,res) => {
				if(err) {
					return done(err);
				}

				Todo.find({text}).then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();	
				}).catch((e) => done(e));

			});
	});


	it('should not create todo with invalid body data', (done) => {

		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err,res) => {
				if(err) {
					return done(err);
				}

				Todo.find().then((todos) => {
					expect(todos.length).toBe(2);
					done();	
				}).catch((e) => done(e));

			});
	});

});

describe('GET /todos', () => {
	it('should get all todos', (done) => {
		request(app)
		.get('/todos')
		.expect(200)
		.expect((res) => {
			expect(res.body.todos.length).toBe(2)
		})
		.end(done);
	});
});

describe('GET /todos/:id', () => {
	it('should return todo doc', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
	});

	it('should return 404 if todo not found', (done) => {
		//get 404 back
		var hexId = new ObjectID().toHexString();
		request(app)
			.get(`/todos/${hexId}`)
			.expect(404)
			.end(done);
	});
	it('should return 404 if non-object id', (done) => {
		//todos/123
		//should get 404 back
		request(app)
			.get('/todos/1234')
			.expect(404)
			.end(done);
	});

});

describe('DELETE /todos/:id', ()=> {
	it('should remove a todo', (done) => {

		var hexId = todos[1]._id.toHexString();
		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(hexId);
			})
			.end((err,res) => {
				if(err) {
					return done(err);
				}

				Todo.findById(hexId).then((doc) => {
					console.log(doc);
					expect(doc).toNotExist();
					done();
				}).catch((e) => done(e));
				//query db using findbyid
				//expect(null).toNotExist()
			})

	});

	it('should return 404 if todo not found', (done) => {
		let hexId = new ObjectID().toHexString();
		request(app)
		.delete(`/todos/${hexId}`)
		.expect(404)
		.end(done);
	});

	it('should return 404 if object id is invalid', (done) => {
		request(app)
		.delete('/todos/1234dg')
		.expect(404)
		.end(done);
	});
});

describe('PATCH /todos/:id', () => {
	it('should update the todo', (done) => {
		//grab id of first item
		let hexId = todos[0]._id.toHexString();
		let text = 'thee text is changed';
		request(app)
		.patch(`/todos/${hexId}`)
		.send({
			completed: true,
			text
		})
		.expect(200)
		.expect((res) => {
			console.log(res.body);
			expect(res.body.todo.completed).toBe(true);
			expect(res.body.todo.text).toBe(text);
			expect(res.body.todo.completedAt).toBeA('number');

		})
		.end(done)
		//update text, set completed true
		//200
		//text is changed, completed is true, completedAt is a number .toBeA
	});

	it('should clear completedAt when todo is not completed', (done) => {
		//grab id of second todo item
		let hexId = todos[0]._id.toHexString();
		let text = 'no longer complete';
		//update text, set completed to false
		request(app)
		.patch(`/todos/${hexId}`)
		.send({
			completed: false,
			text
		})
		.expect(200)
		.expect((res) => {
			console.log(res.body);
			expect(res.body.todo.completed).toBe(false);
			expect(res.body.todo.text).toBe(text);
			expect(res.body.todo.completedAt).toNotExist();

		})
		.end(done);
		//200
		//text is changed, completed false, completedAt is null .toNotExist
	});
});




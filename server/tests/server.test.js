const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todos');
const {User} = require('./../models/user');

const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

// beforeEach((done) => {
// 	Todo.remove({}).then(() => done());
// });

describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		let text = 'test todo text';
		request(app)
			.post('/todos')
			.set('x-auth', users[0].tokens[0].token)
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
			.set('x-auth', users[0].tokens[0].token)
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
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.expect((res) => {
			expect(res.body.todos.length).toBe(1)
		})
		.end(done);
	});
});

describe('GET /todos/:id', () => {
	it('should return todo doc', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
	});

	it('should return NOT todo doc created by different user', (done) => {
		request(app)
			.get(`/todos/${todos[1]._id.toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it('should return 404 if todo not found', (done) => {
		//get 404 back
		var hexId = new ObjectID().toHexString();
		request(app)
			.get(`/todos/${hexId}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});
	it('should return 404 if non-object id', (done) => {
		//todos/123
		//should get 404 back
		request(app)
			.get('/todos/1234')
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});

});

describe('DELETE /todos/:id', ()=> {
	it('should remove a todo', (done) => {

		var hexId = todos[1]._id.toHexString();
		request(app)
			.delete(`/todos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
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
			});

	});

	it('should not remove a todo from other user', (done) => {

		var hexId = todos[0]._id.toHexString();
		request(app)
			.delete(`/todos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end((err,res) => {
				if(err) {
					return done(err);
				}

				Todo.findById(hexId).then((doc) => {
					expect(doc).toExist();
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
		.set('x-auth', users[1].tokens[0].token)
		.expect(404)
		.end(done);
	});

	it('should return 404 if object id is invalid', (done) => {
		request(app)
		.delete('/todos/1234dg')
		.set('x-auth', users[1].tokens[0].token)
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
		.set('x-auth', users[0].tokens[0].token)
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
		.end(done);
		//update text, set completed true
		//200
		//text is changed, completed is true, completedAt is a number .toBeA
	});

	it('should not update the todo as different user', (done) => {
		//grab id of first item
		let hexId = todos[0]._id.toHexString();
		let text = 'thee text is changed';
		request(app)
		.patch(`/todos/${hexId}`)
		.set('x-auth', users[1].tokens[0].token)
		.send({
			completed: true,
			text
		})
		.expect(404)
		.end(done)
		//update text, set completed true
		//200
		//text is changed, completed is true, completedAt is a number .toBeA
	});

	it('should clear completedAt when todo is not completed', (done) => {
		//grab id of second todo item
		let hexId = todos[1]._id.toHexString();
		let text = 'no longer complete';
		//update text, set completed to false
		request(app)
		.patch(`/todos/${hexId}`)
		.set('x-auth', users[1].tokens[0].token)
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

describe('GET /users/me', () => {
	it('should return users if authenticated', (done) => {
		request(app)
			.get('/users/me')
			.set('x-auth', users[0].tokens[0].token)  //header
			.expect(200)
			.expect((res) => {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			})
			.end(done);
	});
	it('should return 401 if  not authenticated', (done) => {
		//expect a 401
		//expect body is an empty object  using toEqual
		request(app)
			.get('/users/me')
			.expect(401)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end(done);
	});
});

describe('POST /users', () => {
	it('should create a user', (done) => {
		let email = 'example@example.com';
		let password  = '123mnb!';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(200)
			.expect((res)=> {
				expect(res.headers['x-auth']).toExist();
				expect(res.body._id).toExist();
				expect(res.body.email).toBe(email);
			})
			.end((err) => {
				if(err) {
					return done(err);
				}
				User.findOne({email}).then((user) => {
					expect(user).toExist();
					expect(user.password).toNotBe(password);
					done();
				}).catch((e) => done(e));
			});

	});

	it('should return validation errors of request invalid', (done) => {
		//expect 400, after sending invalid email
		let email = 'boo';
		let password = 3;

		request(app)
			.post('/users')
			.send({email, password})
			.expect(400)
			.end(done);
	});

	it('should not create user if email in use', (done) => {
		let email = users[0].email;
		let password = 'asdfasasdf';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(400)
			.end(done);
	});
});

describe('POST /users/login', () => {
	it('should login user and return auth token', (done) => {
		let email = users[1].email;
		let password = users[1].password;
		request(app)
			.post('/users/login')
			.send({email, password})
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toExist();
			})
			//use a custom function in end.  err and response are arguments
			.end((err, res) => {
				if(err) {
					return done(err);
				}
				User.findById(users[1]._id).then((user) => {
					expect(user.tokens[1]).toInclude({
						access: 'auth',
						token: res.headers['x-auth']
					});
					done();
				}).catch((e) => done(e));
			});

	});

	it('should reject invalid login', (done) => {
		let email = users[1].email;
		let password = users[1].password + '1';
		request(app)
			.post('/users/login')
			.send({email, password})
			.expect(400)
			.expect((res) => {
				expect(res.headers['x-auth']).toNotExist();
			})
			//use a custom function in end.  err and response are arguments
			//use this if you need to make asychronous assertion
			.end((err, res) => {
				if(err) {
					return done(err);
				}
				User.findById(users[1]._id).then((user) => {
					expect(user.tokens.length).toBe(1);
					done();
				}).catch((e) => done(e));
			});
	});
});

describe('DELETE /users/me/token', () => {
	it('should remove auth token on logout', (done) => {
		request(app)
		.delete('/users/me/token')
		.set('x-auth', users[0].tokens[0].token)  //header
		.expect(200)
		.end((err, res) => {
			if(err) {
				return done(err);
			}
			User.findById(users[0]._id).then((user) => {
				expect(user.tokens.length).toBe(0);
				done();
			}).catch((e) => done(e));
		});
	});
});

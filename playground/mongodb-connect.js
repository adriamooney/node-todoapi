// const MongoClient = require('mongodb').MongoClient;

//this code is the same as code above, but now we have access to the MongoClient as well as ObjectID variables, which
//are properties of the mongodb object.
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

//object destructuring lets you pull out properties from an object, creating variables
// let user = {name: 'andrew', age: 35};
// //set to name property to the name of the object. this will return the value of the name property
// let {name} = user;


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if(err) {
		return console.log('unable to connect to mongo db server');
	}

	console.log('Connected to mongo db server');

	// db.collection('ToDos').insertOne({
	// 	text: 'something to do',
	// 	completed: false
	// }, (err, result) => {
	// 	if(err) {
	// 		return console.log('unable to insert todo', err);
	// 	}
	// 	console.log(JSON.stringify(result.ops, undefined, 4));
	// });

	//insert new doc into users collection with name, age, location

	// db.collection('Users').insertOne({
	// 	name: 'adria',
	// 	age: 36,
	// 	location: 'Portland, Oregon'
	// }, (err, result) => {
	// 	if(err) {
	// 		return console.log('unable to insert user', err);
	// 	}
	// 	// console.log(JSON.stringify(result.ops, undefined, 4));
	// 	console.log(result.ops[0]._id.getTimestamp());
	// });

	db.close();
});


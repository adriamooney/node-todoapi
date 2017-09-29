//are properties of the mongodb object.
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if(err) {
		return console.log('unable to connect to mongo db server');
	}

	console.log('Connected to mongo db server');

	//find returns a cursor.  you can add the toArray method
	//to return the docs as an array. toArray allows Promise,
	//so you can add .then
	// db.collection('ToDos').find({_id: new ObjectID('59cd4ec06606c3c2a7953d02')}).toArray().then((docs) => {
	// 	console.log('Todos');
	// 	console.log(JSON.stringify(docs,undefined,4));
	// }, (err) => {
	// 	console.log('unable to fetch todos', err);
	// });


	db.collection('ToDos').find().count().then((count) => {
		console.log(`Todos: ${count}`);
	}, (err) => {
		console.log('unable to fetch todos', err);
	});

	//db.close();
});


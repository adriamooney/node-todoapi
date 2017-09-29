//are properties of the mongodb object.
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if(err) {
		return console.log('unable to connect to mongo db server');
	}

	console.log('Connected to mongo db server');

	//deleteMany

	// db.collection('Todos').deleteMany({text: 'eat lunch'}).then((result) => {
	// 	console.log(result);
	// });

	//deleteOne
	//same as deleteMany, but only deletes first one it finds that matches criteria

	// db.collection('Todos').deleteOne({text: 'eat lunch'}).then((result) => {
	// 	console.log(result);
	// });

	//findOneAndDelete
	db.collection('ToDos').findOneAndDelete({completed: false}).then((result) => {
		console.log(result);
	});



	//db.close();

});
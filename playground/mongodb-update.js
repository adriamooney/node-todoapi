//are properties of the mongodb object.
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if(err) {
		return console.log('unable to connect to mongo db server');
	}

	console.log('Connected to mongo db server');



	//findOneAndUpdate(filter, update, options, callback)
	//returns a Promise if no callback is passed

	db.collection('ToDos').findOneAndUpdate({
		_id: new ObjectID('59cdae796606c3c2a795673e')

	}, {
		$set: {
			completed: true
		}
	},{
		returnOriginal: false
	}).then((result) => {
		console.log(result);
	});



	//db.close();

});
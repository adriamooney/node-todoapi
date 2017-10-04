const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todos');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
// 	console.log(result);
// });

//Todo.findOneAndRemove({})

Todo.findByIdAndRemove('59d2ee166606c3c2a7963069').then((doc) => {
	console.log(doc);
});

// Todo.findOneAndRemove({_id: '59d2ee166606c3c2a7963069'}).then((doc) => {
// 	console.log(doc);
// });



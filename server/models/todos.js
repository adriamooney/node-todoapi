const mongoose = require('mongoose');

//this is a model:
let Todo = mongoose.model('Todo', {
	text: {
		type: String,
		required: true,
		minlength: 1,
		trim: true //trims whitespace
	},
	completed: {
		type: Boolean,
		default: false

	},
	completedAt: {
		type: Number,
		default: null
	}
});

// let newTodo = new Todo({
// 	text: 'cook dinner'
// });

// //saves to db, and returns a Promise
// newTodo.save().then((doc) => {
// 	console.log('saved todo', doc)
// }, (err) => {
// 	console.log('unable to save todo', err)
// });

module.exports = {Todo};

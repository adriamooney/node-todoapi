const mongoose = require('mongoose');
const isbn = require('node-isbn');
const _ = require('lodash');
const mongoosePaginate = require('mongoose-paginate');
// const searchable = require('mongoose-searchable');

//this is a model:
const BookSchema = new mongoose.Schema({
	authors: {type: [String], index: true, text: true},
	_creator: {
		required: true,
		type: mongoose.Schema.Types.ObjectId
	},
	title: {
		type: String,
		text: true,
		index: true
	},
	isbn: {
		type: String,
		unique: true,
		required: true,
		text: true,
		index: true
	},
	publisher: {
		type: String
	},
	publishedDate: {
		type: String
	},
	industryIdentifiers: [{
		 type: {type:String},
		 identifier: {type:String}
	}],
	readingModes: {
        text: {type:Boolean},
        image: {type:Boolean}
    },
  	pageCount: {
  		type: Number
  	},
  	printType: {
  		type: String
  	},
  	categories: [String],
  	averateRating: {
  		type: Number
  	},
  	ratingsCount: {
  		type: Number
  	},
  	contentVersion: {
  		type: String
  	},
  	previewLink: {
  		type: String
  	},
  	infoLink: {
  		type: String
  	},
  	canonicalVolumeLink: {
  		type: String
  	},
	rating: {
		type: String
	},
	read: {
		type: String
	},
	series_details: {
		type: String
	},
	pages: {
		type: String
	},
	notes: {
		type: String
	},
	list_price: {
		type: String
	},
  	format: {
		type: String
	},
  	description: {
		type: String
	},
	genre: {
		type: String
	},
  	language: {
		type: String
	},
  	date_added: {
		type: String
	},
  	last_update_date: {
		type: String
	},
  	book_uuid: {
		type: String
	},
	imageLinks: {
		smallThumbnail: {type: String},
		thumbnail: {type:String}
    }
});

// isbn.resolve(isbn, function (err, book) {
//     if (err) {
//         console.log('Book not found', err);
//     } else {
//         console.log('Book found %j', book);
//     }
// });

//mongoose middleware, executes before doc is saved to database
BookSchema.pre('save', function(next) {
	let book = this;

	// return new Promise((resolve, reject) => {

		isbn.resolve(book.isbn, function (err, bk) {
		    if (err) {
		    	let error = new Error(err);
		        next(error);

		    } else {
		        _.merge(book, bk);
		        next();
		    }
		});
	// });
	
});

BookSchema.index({isbn: 'text', authors: 'text', title: 'text'});

BookSchema.plugin(mongoosePaginate);

// BookSchema.plugin(searchable);

let Book = mongoose.model('Book', BookSchema);

// {
//     "title": "Code Complete",
//     "authors": [
//         "Steve McConnell"
//     ],
//     "publisher": "O'Reilly Media, Inc.",
//     "publishedDate": "2004",
//     "description": "Features the best practices in the art and...",
//     "industryIdentifiers": [
//         {
//             "type": "OTHER",
//             "identifier": "UCSC:32106018687688"
//         }
//     ],
//     "readingModes": {
//         "text": false,
//         "image": false
//     },
//     "pageCount": 914,
//     "printType": "BOOK",
//     "categories": [
//         "Computers"
//     ],
//     "averageRating": 4,
//     "ratingsCount": 123,
//     "contentVersion": "preview-1.0.0",
//     "imageLinks": {
//         "smallThumbnail": "http://books.google.com/books/content?id=QnghAQAAIAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api",
//         "thumbnail": "http://books.google.com/books/content?id=QnghAQAAIAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
//     },
//     "language": "en",
//     "previewLink": "http://books.google.es/books?id=QnghAQAAIAAJ&dq=isbn:0735619670&hl=&cd=1&source=gbs_api",
//     "infoLink": "http://books.google.es/books?id=QnghAQAAIAAJ&dq=isbn:0735619670&hl=&source=gbs_api",
//     "canonicalVolumeLink": "http://books.google.es/books/about/Code_Complete.html?hl=&id=QnghAQAAIAAJ"
// }

module.exports = {Book};

const {SHA256} = require('crypto-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let password = '123abc!'

bcrypt.genSalt(10, (err, salt) => {
	bcrypt.hash(password, salt, (err, hash) => {
		console.log(hash);
	});
});

let hashedPassword = '$2a$10$AAzCuYX6hVbmpvLkZMnyw.XtGhgKbxvGLHU5HEM4SYSunAXMJw/DC';

bcrypt.compare(password, hashedPassword, (err, res) => {
	console.log(res);
});

// jwt.sign   //takes data and creates hash and returns value
// jwt.verify //makes sure the data was not changed


// let data = {
// 	id: 10
// }
// let token = jwt.sign(data, '123abc');
// console.log(token);

// let decoded = jwt.verify(token, '123abc');
// console.log(decoded);



// let message = 'I am user number 3'
// let hash = SHA256(message).toString();


// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// let data = {
// 	id: 4
// };

// let token = {
// 	data,
// 	hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();

// let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if(resultHash === token.hash) {
// 	console.log('data was not changed');
// } else {
// 	console.log('data was changed. do not trust');
// }
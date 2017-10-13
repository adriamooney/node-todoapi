const env = process.env.NODE_ENV || 'development';


if(env === 'development' || env === 'test') {
	let config = require('./config.json');

	//sets to config.test or config.development:
	let envConfig = config[env];
	 console.log(envConfig);

	//for each of envConfig keys (PORT and MONGDB_URI),
	//set the value from envConfig into the process.env
	Object.keys(envConfig).forEach((key)=> {
		// sets the process.env key (PORT or MONGDB_URI) to whatever the value is in envConfig
		//for example:
		//process.env.PORT = '3000'
		process.env[key] = envConfig[key];	
	});


}

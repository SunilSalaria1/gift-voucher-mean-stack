# gift-voucher-mean-stack

Primary Admin : Administrator Code - LPIT21871281
Administrator Key - adm04082000

MEAN stack gift voucher.

## client detail :

- Angular V-18
- angular m-18 [Azure & Blue]
- npm start [to run the angular application http://localhost:4200/]

## server detail :

- http://localhost:3000 [express localhost]
- http://localhost:3000/api/v1/doc/ [swagger localhost]
- "scripts": {
  "start": "node ./bin/www",
  "server": "nodemon app.js",
  "swagger": "node ./swagger.js"
  },

- [need to run all three packages from scripts to run the environment]

## steps to install + setup node environment :

- connect with the MongoDB database via Express js:

  - Go the the src/config/db.config.js file, add a reference to the mongoDB and then use the below line of code to connect to the database.
    const url = 'mongodb://localhost:27017';
    const client = new MongoClient(url);
    const dbName = 'blog';
    async function connectDB() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server')
    return 'done.';
    }
    connectDB()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());
    const db = client.db(dbName);
    module.exports = { client, db, connectDB };
    require your exported modules in app.js t0 initialize your DB FIle like this---(require("./src/config/db.config");)

## swagger setup

- npm i swagger-autogen ("swagger-autogen": "^2.23.7")version
- npm i swagger-ui-express ("swagger-ui-express": "^5.0.1")version

- need to create swager.js file in root of project and also copy code from swagger.js and paste in new file.
- in app.js import swagger as -:
  const swaggerUi = require('swagger-ui-express');
  const swaggerFile = require('./swagger-output.json');
- app.use('/api/v1/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
- create new swagger-output.json file in root as well for output.

## Final step is RUN below 3 scripts to run project/server/swagger.

"scripts": {
"start": "node ./bin/www",
"server": "nodemon app.js",
"swagger": "node ./swagger.js"
},

## i am using Zod is a TypeScript-first schema validation library for JavaScript and Node.js.

Installation Command:- npm install zod --- ("zod": "^3.24.1")version

## i am using MongoDB is a NoSQL database that stores data in a flexible, JSON-like format. Instead of tables and rows (like SQL databases), it uses collections and documents.

Installation Command:- npm install mongodb --- ("mongodb": "^6.13.1")version

## i am using bcryptjs is a JavaScript library used to hash passwords securely in Node.js.

Installation Command:- npm install bcryptjs --- ("bcryptjs": "^2.4.3")version

## i am using multer for storing images as buffers in a database & it is a (middleware for handling multipart/form-data in Node.js.)

Installation Command:- npm install multer --- ("multer": "^1.4.5-lts.1")version

## The jsonwebtoken library (jwt) is used for creating, signing, and verifying JSON Web Tokens (JWTs)

Installation Command:- npm install jsonwebtoken --- ("jsonwebtoken": "^9.0.2")version

## i am using Cors (Cross-Origin Resource Sharing) is a Node.js middleware that allows or restricts access to your API from different domains (origins).

Installation Command:- npm install cors --- ("cors": "^2.8.5")version

## i am using dotenv is a Node.js package that loads environment variables from a .env file into process.env.

Installation Command:- npm install dotenv --- ("dotenv": "^16.4.7",)version

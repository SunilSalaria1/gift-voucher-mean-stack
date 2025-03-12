# gift-voucher-mean-stack

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

## Zod is a TypeScript-first schema validation library for JavaScript and Node.js.

Installation Command:- npm install zod --- ("zod": "^3.24.1")version

## MongoDB is a NoSQL database that stores data in a flexible, JSON-like format. Instead of tables and rows (like SQL databases), it uses collections and documents.

Installation Command:- npm install mongodb --- ("mongodb": "^6.13.1")version

## bcryptjs is a JavaScript library used to hash passwords securely in Node.js.

Installation Command:- npm install bcryptjs --- ("bcryptjs": "^2.4.3")version

## multer for storing images as buffers in a database & it is a (middleware for handling multipart/form-data in Node.js.)

Installation Command:- npm install multer --- ("multer": "^1.4.5-lts.1")version

## The jsonwebtoken library (jwt) is used for creating, signing, and verifying JSON Web Tokens (JWTs)

Installation Command:- npm install jsonwebtoken --- ("jsonwebtoken": "^9.0.2")version

## Cors (Cross-Origin Resource Sharing) is a Node.js middleware that allows or restricts access to your API from different domains (origins).

Installation Command:- npm install cors --- ("cors": "^2.8.5")version

## dotenv is a Node.js package that loads environment variables from a .env file into process.env.

Installation Command:- npm install dotenv --- ("dotenv": "^16.4.7",)version

## project attachments:

![employee-picks-page](https://github.com/user-attachments/assets/c2d73dbd-d5a2-4571-a6d0-847a7f2f6fc5)
![employee-login-page](https://github.com/user-attachments/assets/c516dc2c-a372-4888-8801-3e39ca464e74)
![edit-gift-item-page](https://github.com/user-attachments/assets/662ffa39-f60e-4d93-9fea-990119bab271)
![edit-empcode-page](https://github.com/user-attachments/assets/0aca2b31-5981-4834-9b7b-fc643aaa20bc)
![dashboard-page](https://github.com/user-attachments/assets/8c4aeb72-e198-43b5-a836-61f094d93b30)
![admin-profile-settings-page](https://github.com/user-attachments/assets/f25f7ccb-f269-42ed-9022-a77abd36701e)
![admin-login-page](https://github.com/user-attachments/assets/77f43f5b-87d6-4ac9-b902-5f4934b60d0b)
![add-gift-item-page](https://github.com/user-attachments/assets/904a644c-2844-4df7-9a5f-2ac18a9cb657)
![add-empcode-page](https://github.com/user-attachments/assets/d6897d0b-e864-4aff-9ddf-63bbd278c069)
![suggestions-page](https://github.com/user-attachments/assets/ee4425de-517f-4b14-a287-8589f4cb251f)
![select-gift-voucher-page](https://github.com/user-attachments/assets/bde03e3b-a712-4884-b778-bced743eff70)
![selected-gift-details-page](https://github.com/user-attachments/assets/e8b333ba-b1a7-4aeb-937a-7767da7b52ff)
![reward-claimed-page](https://github.com/user-attachments/assets/60a00d70-8090-4d46-9848-e0516919cb28)
![page-not-found](https://github.com/user-attachments/assets/532b6f6b-e1dc-46d5-a29c-c54d1de7621a)
![home-page](https://github.com/user-attachments/assets/6bf97bfb-d8d1-419a-9ce4-96648598e00e)
![gift-inventory-page](https://github.com/user-attachments/assets/86db5e8e-be92-4dfc-9736-3307eec8f69d)
![generate-empcode-page](https://github.com/user-attachments/assets/d8fb55b4-98e3-499f-9fa2-4d5b26f890f8)


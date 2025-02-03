# gift-voucher-mean-stack

administrator :- Ad1234 | 123123 , employee :- Lp1234

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

<!-- - npx express-generator [https://expressjs.com/en/starter/generator.html]

- create a MongoDB database (used sunil.salaria@lpinfotech.com for this project) [https://cloud.mongodb.com/v2/658e6346ad14f147c8beae92#/clusters]

- npm i mongoose [https://www.npmjs.com/package/mongoose] Install Mongoose library to connect with MongoDB and make modals/schemas. -->

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

- npm i swagger-autogen
- npm i swagger-ui-express

- need to create swager.js file in root of project and also copy code from swagger.js and paste in new file.
- in app.js import swagger as well like below :
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

## i am using zod for models

- npm install mongodb zod --- i have install zod using this command.
- npm i mongodb --- i have also installed mongodb for that beore using command.

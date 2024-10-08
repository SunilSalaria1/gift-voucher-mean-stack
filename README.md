# gift-voucher-mean-stack

MEAN stack gift voucher.

## client detail :

- Angular V-18
- angular m-18 [Azure & Blue]
- npm start [to run the angular application http://localhost:4200/]

## server detail :

- http://localhost:3000             [express localhost]
- http://localhost:3000/api/v1/doc/ [swagger localhost]
- "scripts": {
    "start": "node ./bin/www",
    "server": "nodemon app.js",
    "swagger": "node ./swagger.js"
  }, 
- [need to run all three packages from scripts to run the environment]

## steps to install + setup node environment : 

- npx express-generator [https://expressjs.com/en/starter/generator.html]
- create a MongoDB database (used sunil.salaria@lpinfotech.com for this project) [https://cloud.mongodb.com/v2/658e6346ad14f147c8beae92#/clusters]
- npm i mongoose Install [https://www.npmjs.com/package/mongoose] Mongoose library to connect with MongoDB and make modals/schemas.
- connect with the MongoDB database via Express js:
   - Go the the app.js file, add a reference to the mongoose and then use the below line of code to connect to the database. 
    - const mongoose = require("mongoose");
    - const uri = "mongodb+srv://sunilsalaria:T6MSABNP5uROukEa@cluster0.rolwxi5.mongodb.net/Gift-Voucher?retryWrites=true&w=majority&appName=Cluster0";
    - .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

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
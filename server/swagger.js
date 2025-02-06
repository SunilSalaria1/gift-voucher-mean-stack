const swaggerAutogen = require('swagger-autogen')();
const fs = require("fs");
const { register } = require('module');
const { updateUser } = require('./src/controllers/user.controller');

const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  host: 'localhost:3000',
  tags: [                   // by default: empty Array
    {
      name: 'Users',             // Tag name
      description: 'User Routes'       // Tag description
    },
    // { ... }
  ],
  securityDefinitions: {
    Bearer: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 1safsfsdfdfd\""
    }
  },
  definitions: {
    registerUser: {
      dob: new Date().toString(),
      joiningDate: new Date().toString(),
      email: "aniket98578@gmail.com",
      name: "Aniket Sharma",
      department: "Frontend"
    },
    updateUser: {
      name: "Aniket Sharma",
      department: "Front End"
    },
    loginUser: {
      empCode: "LP12121212",
      password: "ani04082000"
    },
  }
};

const outputFile = './swagger-output.json';
const routes = ['./src/routes/index.js'];
if (fs.existsSync("./swagger-output.json")) { swaggerAutogen(outputFile, routes, doc); }

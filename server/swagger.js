const swaggerAutogen = require('swagger-autogen')();
const fs = require("fs");
const { register } = require('module');
const { updateUser } = require('./src/controllers/user.controller');
const { createEvent } = require('./src/controllers/event.controller');

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
    loginAdmin: {
      employeeCode: "LPIT30281076",
      password: "jyo04122001",
      role: "admin"
    },
    loginUser: {
      employeeCode: "LPIT30281076",
      role: "employee"
    },
    createAdmin: {
      id: "67a4af8cf19f72c03d3d4547",
      isAdmin: true
    }
    ,
    addProduct: {
      couponCode: "lp12345",
      productImageId: "image id",
      productDescription: "this product is good",
      productTitle: "bottle"
    },
    UpdateProduct: {
      couponCode: "lp12345",
      productImageId: "image id",
      productDescription: "this product is good",
      productTitle: "bottle"
    },
    UpdateUserGiftPick: {
      isPicked: 'completed',
      productId: "productId"
    },
    DeleteUserGiftPick: {
      isPicked: 'pending',
    },
    createEvent: {
      title: "A friendly Cricket Match",
      about: "A friendly Cricket Match",
      imageId: "string imageId",
      address: "mohali 8b near airport road",
      date: "01/03/2025",
      city: "mohali",
      startTime: "hh:mm AM/PM",
      endTime: "hh:mm AM/PM",
      note: "optional",
      whyYouAttend: "optional"
    },
    updateEvent: {
      title: "A friendly Cricket Match",
      about: "A friendly Cricket Match",
      imageId: "string imageId",
      address: "mohali 8b near airport road",
      date: "01/03/2025",
      city: "mohali",
      startTime: "hh:mm AM/PM",
      endTime: "hh:mm AM/PM",
      note: "optional",
      whyYouAttend: "optional"
    },
  }
};

const outputFile = './swagger-output.json';
const routes = ['./src/routes/index.js'];
if (fs.existsSync("./swagger-output.json")) { swaggerAutogen(outputFile, routes, doc); }

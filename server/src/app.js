// require("./config/db.config");

// let express = require('express');
// let logger = require('morgan');
// const swaggerUi = require('swagger-ui-express');
// const swaggerFile = require('../swagger-output.json');
// const userRouter = require("./routes/user.router");
// const app = express();
// const globalRouter = require("./routes/index");
// const cors = require('cors')
// let corsOptions = {
//   origin: '*'
// }
// app.use(cors(corsOptions))

// //json data get/post request manage
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// //configures the app to serve static files

// app.use(globalRouter);
// app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));





// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });



// app.listen(3000, () => console.log("http://localhost:3000/api-doc"))
require("./config/db.config");

const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger-output.json');
const globalRouter = require("./routes/index");

const app = express();

// ✅ Best practice CORS options
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = ['http://localhost:4200', 'http://localhost:3000']; // Define trusted origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Restrict methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Restrict headers
  credentials: true, // Enable credentials if needed
};

// Apply CORS middleware
app.use(cors(corsOptions));

// JSON request handling
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving and routing
app.use(globalRouter);
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Error handler middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {},
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}/api-doc`));

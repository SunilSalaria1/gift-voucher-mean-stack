var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const mongoose = require("mongoose"); 
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const uri = "mongodb+srv://sunilsalaria:T6MSABNP5uROukEa@cluster0.rolwxi5.mongodb.net/Gift-Voucher?retryWrites=true&w=majority&appName=Cluster0";
//mongoose connection  + mongo DB
mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
//json data get/post request manage
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//configures the app to serve static files
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
//swagger
app.use('/api/v1/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

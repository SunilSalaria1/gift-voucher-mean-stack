require("./config/db.config");

let express = require('express');
let logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger-output.json');
const userRouter = require("./routes/user.router");
const app = express();
const globalRouter = require("./routes/index");


//json data get/post request manage
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//configures the app to serve static files

app.use(globalRouter);
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));





// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



app.listen(3000, () => console.log("http://localhost:3000/api-doc"))

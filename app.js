var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

passportService = require('./config/passport');


var officeRouter = require('./routes/officeRouter');
var towerRouter = require('./routes/towerRouter');
var userRouter = require('./routes/userRouter');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


let io;//inject io in request
app.use(function (req, res, next) {
  if (!io)
    io = require('./controller/socketIO').io;
  req.io = io;
  next();
});

app.use('/office', officeRouter);
app.use('/tower', towerRouter);
app.use('/user', userRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});



// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

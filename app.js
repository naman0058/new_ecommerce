var createError = require('http-errors');
const http = require('http');
var cookieSession = require('cookie-session')
var cookieParser = require('cookie-parser');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var admin = require('./routes/Admin/Login');
var adminDashboard = require('./routes/Admin/Dashboard');

var agent = require('./routes/Agent/Login');
var agentdashboard = require('./routes/Agent/Dashboard')
var api = require('./routes/api')


var app = express();


var corsOptions = {
  origin: 'https://dealsaaj.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(cookieSession({
  name: 'session',
  keys: ['inventory'],
 
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin',admin);
app.use('/admin/dashboard',adminDashboard);
app.use('/agent',agent);
app.use('/agent/dashboard',agentdashboard);
app.use('/api',api);


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

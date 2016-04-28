var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');

var app = express();

app.use(flash());

app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "http://localhost");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

app.use(express.static('../client'));
app.use(bodyParser.json()); 


//initialize mongoose schemas
require('./models/user');
require('./models/product');
var mongoose = require('mongoose');                         //add for Mongo support

//connect to Mongo
if (app.get('env') === 'production') {
    mongoose.connect('mongodb://testUser:testPassword@ds021989.mlab.com:21989/bookstore'); 
}
else{
    mongoose.connect('mongodb://localhost/bookstore');             
}

var authenticate = require('./routes/authenticate')(passport);
var userProfile = require('./routes/userProfile');
var manageProducts = require('./routes/manageProducts');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(session({
  secret: 'keyboard cat',
  cookie:{
    maxAge : 360000 // one hour in millis
 }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

//// Initialize Passport
var initPassport = require('./passport-init');
initPassport(passport);

app.use('/auth', authenticate);
app.use('/userProfile', userProfile);
app.use('/product', manageProducts);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
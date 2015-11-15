var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var _ = require('underscore');

var routes = require('./routes/index');
var routesB = require('./routes/index_backbone');
var users = require('./routes/users');

var app = express();

app.locals.hi ='Hi';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use('/', routes);
app.use('/insta', routesB);
app.use('/users', users);

//var users = [];

//app.get('/users', function(req, res) {
//  res.locals.hi = ' hi'
//  res.json(users);
//});

app.get('/users/:user_id', function(req, res) {
  res.json(_.find(users, function(user) { return user.id == req.params.user_id }));
});

app.post('/users', function(req, res) {
  users.push(_.extend(req.body, { id: _.uniqueId() }));
  res.json(users);
});

app.put('/users/:user_id', function(req, res) {
  var user = _.find(users, function(user) { return user.id == req.params.user_id });
  user.name = req.body.name;
  res.json(user);
});

app.delete('/users/:user_id', function(req, res) {
  users = _.reject(users, function(user) { return user.id == req.params.user_id });
  res.json({});
});

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

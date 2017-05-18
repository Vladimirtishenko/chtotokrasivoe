var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var socketHandler = require('./middleware/socketFrontController');
var cookie = require('cookie');
var config = require('./config');
var MongoStore = require('connect-mongo')(session);

global.__approot = __dirname;

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(cookieParser());
var sessionMiddleware = session({
  secret: config.get("secret"),
  store: new MongoStore(config.get("db")),
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    expires: new Date(Date.now() + 3600 * 1000 * 24), //setting cookie to not expire on session end
    maxAge: 3600 * 1000 * 24, //one day
    key: 'connect.sid'
  }
});
//
app.use(sessionMiddleware);
io.use(function(socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});
//
// view engine setup
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views/manage')] );
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

require('./routes/routs')(app);

new socketHandler(io);


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

http.listen(config.get('port'), function(){
  console.log('listening on ' + config.get('port'));
});
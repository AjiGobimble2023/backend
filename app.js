var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var {decodeToken} = require('./middleware');
var AuthRouter = require('./app/auth/router');
var NewsRouter = require('./app/news/router')
var EventsRouter = require('./app/events/router')
var DiscusRouter = require('./app/discussionTopic/router')
var UserRouter = require('./app/user/router')

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public/images/news', express.static(path.join(__dirname, 'public/images/news')));
app.use('/public/images/events', express.static(path.join(__dirname, 'public/images/events')));
app.use('/public/images/discus', express.static(path.join(__dirname, 'public/images/discus')));
app.use('/public/images/user', express.static(path.join(__dirname, 'public/images/user')));
app.use(decodeToken());

app.use('/api', AuthRouter);
app.use('/api', NewsRouter);
app.use('/api', EventsRouter);
app.use('/api', DiscusRouter);
app.use('/api', UserRouter);

app.use('/',function (req,res){
  res.render('index',{
   title: "Campus"
  })
 });
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

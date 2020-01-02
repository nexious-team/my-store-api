const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const routes = require('./routes');
const passport = require('./plugins/passport');
const helpers = require('./routes/routers/helpers')
const Sentry = require('@sentry/node');

const app = express();

Sentry.init({ dsn: 'https://02cf351a4b8447038b02d345ea867521@sentry.io/1863276' });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(Sentry.Handlers.requestHandler({
  user: ['_id', 'email']
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

routes(app);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(Sentry.Handlers.errorHandler());
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  helpers.logger.error(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;

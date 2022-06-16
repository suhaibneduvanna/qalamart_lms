var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var mainRouter = require('./routes/index');
var fileUpload = require('express-fileupload')
var db = require('./config/connection')
var session = require('express-session');
const { randomUUID } = require('crypto');
var app = express();
var cookiesId = randomUUID();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout/', partialsDir: __dirname + '/views/partials/' }))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())
app.use(session({ secret: "key", cookie: { maxAge: 36000000} }))
db.connect((err) => {
  if (err) console.log("error" + err);
  else console.log('db connected');

})
app.use('/', mainRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  let errCode = err.status;
  console.log(errCode);
  // render the error page
  if (errCode = "404") {
    res.status(err.status || 404);
    res.render('error_404', { layout: "error_layout.hbs" });
  } else if (errCode == "500") {
    res.status(err.status || 500);
    res.render('error_505', { layout: "error_layout.hbs" });
  } else {
    res.status(err.status || 500);
    res.render('error', { layout: "error_layout.hbs", errCode });
  }


});

module.exports = app;

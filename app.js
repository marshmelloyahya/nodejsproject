var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');


var app = express();

// view engine setup

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
app.get('/', (req, res) => {
	res.json({ message: 'Healthy', status: 200, env: process.env.NODE_ENV });
});
// import all routes
const usersRouter = require('./routes/users');
//enable users routes
app.use('/users', usersRouter);
const articlesRouter = require('./routes/articles');
//enable articles routes
app.use('/articles', articlesRouter);

const CategoriesRouter = require('./routes/categories');
//enable categories routes
app.use('/categories', CategoriesRouter);

const CommentsRouter = require('./routes/commentaires');
//enable comments routes
app.use('/comments', CommentsRouter);

module.exports = app;

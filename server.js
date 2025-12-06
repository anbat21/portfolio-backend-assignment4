// COMP229 – Assignment 2 (Backend) – CommonJS format
var express = require('express');
var cors = require('cors');
var createError = require('http-errors');
var logger = require('morgan');
var dotenv = require('dotenv');
dotenv.config();

var configDb = require('./app/config/db');
var indexRouter = require('./app/routers/index');
var contactsRouter = require('./app/routers/contacts.routes');
var projectsRouter = require('./app/routers/projects.routes');
var servicesRouter = require('./app/routers/services.routes');
var usersRouter = require('./app/routers/users.routes');

var errorHandler = require('./app/middlewares/errorHandler');

var app = express();

configDb();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.json({ message: "Welcome to My Portfolio application" });
});
// root & api routes
app.use('/', indexRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/users', usersRouter);

// 404
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler (last)
app.use(errorHandler);

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
   console.log(`Server running at http://localhost:${PORT}`);
});

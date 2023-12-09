var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/assuranceCarriers');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const mongoose = require('mongoose');
const { Console } = require('console');
const DB_ULR = (process.env.DB_ULR || 'mongodb://localhost/test');

mongoose.connect(DB_ULR);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'db connection error'));

module.exports = app;

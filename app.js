var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var assuranceCarriersRouter = require('./routes/assuranceCarriers');
var authorizationsRouter = require('./routes/authorizations');
var feesRouter = require('./routes/fees');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/assurance_carriers', assuranceCarriersRouter);
app.use('/api/v1/authorizations', authorizationsRouter);
app.use('/api/v1/fees', feesRouter);



const mongoose = require('mongoose');
const DB_URL = (process.env.DB_URL || 'mongodb+srv://assurance_db_user:Q1zgoIFMyIEjAoAs@cluster0.miuwv1w.mongodb.net/assurance_db?retryWrites=true&w=majority');
console.log("Connecting to database: %s", DB_URL);

mongoose.connect(DB_URL);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'db connection error'));

module.exports = app;

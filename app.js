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

module.exports = app;

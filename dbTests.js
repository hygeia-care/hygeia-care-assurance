const mongoose = require('mongoose');

// Database for integration tests
const DB_URL_TEST = (process.env.DB_URL_TEST || 'mongodb://localhost/test');
console.log("Connecting to database: %s", DB_URL_TEST);

mongoose.connect(DB_URL_TEST);
const dbConnectTest = mongoose.connection;

dbConnectTest.on('error', console.error.bind(console, 'dbConnectTest connection error'));

// Export
module.exports = dbConnectTest;
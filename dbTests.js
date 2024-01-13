const mongoose = require('mongoose');

// Database for integration tests
const DB_URL_TEST = (process.env.DB_URL_TEST || 'mongodb+srv://assurance_db_user:Q1zgoIFMyIEjAoAs@cluster0.miuwv1w.mongodb.net/assurance_db_test?retryWrites=true&w=majority');
console.log("Connecting to database: %s", DB_URL_TEST);

mongoose.connect(DB_URL_TEST);
const dbConnectTest = mongoose.connection;

dbConnectTest.on('error', console.error.bind(console, 'dbConnectTest connection error'));

// Export
module.exports = dbConnectTest;
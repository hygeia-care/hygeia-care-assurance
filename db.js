const mongoose = require('mongoose');

// Database
const DB_URL = (process.env.DB_URL || 'mongodb+srv://assurance_db_user:Q1zgoIFMyIEjAoAs@cluster0.miuwv1w.mongodb.net/assurance_db?retryWrites=true&w=majority');
console.log("Connecting to database: %s", DB_URL);

mongoose.connect(DB_URL);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'db connection error'));

// Export
module.exports = db;
const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

module.exports = client;
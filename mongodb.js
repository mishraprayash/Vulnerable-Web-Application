
const { MongoClient } = require('mongodb')

// use the proper uri-string as per the requirement.
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

module.exports = client
const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'blog';
async function connectDB() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server')
    return 'done.';
}
connectDB()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());
const db = client.db(dbName);

module.exports = { client, db, connectDB };
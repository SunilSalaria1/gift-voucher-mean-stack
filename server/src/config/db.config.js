const { MongoClient } = require('mongodb');
const url = 'mongodb+srv://aniketsharma:UxFmcjc3eNBaMWve@cluster0.xv0iu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(url);
const dbName = 'giftChase';
async function connectDB() {
    try {
        // Use connect method to connect to the server
        await client.connect();
        console.log('Connected successfully to server')
        return 'done.';
    } catch (e) {
        console.log(e)
    }

}

connectDB()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());
const db = client.db(dbName);
module.exports = { client, db, connectDB };
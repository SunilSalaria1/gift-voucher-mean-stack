const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load .env variables

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => console.log('MongoDB connected'))
   .catch(err => console.log(err));

// Basic route
app.get('/', (req, res) => {
   res.send('Hello from the backend!');
});

// Start the server
app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});

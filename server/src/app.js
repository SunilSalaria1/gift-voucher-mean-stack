require("./config/db.config");
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger-output.json');
const globalRouter = require("./routes/index");

const PORT = process.env.PORT ;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

const app = express();

//  Best practice CORS options

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = CORS_ORIGIN; // Define trusted origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Restrict methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Restrict headers
  credentials: true, // Enable credentials if needed
};

// Apply CORS middleware
app.use(cors(corsOptions));

// JSON request handling
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving and routing
app.use(globalRouter);
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Error handler middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {},
  });
});

// Start the server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}/api-doc`));
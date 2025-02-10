const jwt = require('jsonwebtoken');
const SECRET_KEY = "Aniwer32432@#^%&^#!%@&#%&%!@#!&%@#!&@2153"

const authenticateToken = (req, res, next) => {
    // 1. Get token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // 2. Check if token is not present
    if (!token) {
        return res.status(401).json({ message: 'No token provided. Invalid token.' });
    }

    // 3. Verify the token
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                // If the token is expired, return the token expired error
                return res.status(401).json({ message: 'Token expired' });
            } else {
                // If any other error (e.g., invalid token), return invalid token error
                return res.status(403).json({ message: 'Invalid token' });
            }
        }

        // Attach the user information (decoded token) to the request object
        req.user = user;

        // Call the next middleware or route handler
        next();
    });
};

module.exports = { authenticateToken };
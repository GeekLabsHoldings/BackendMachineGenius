const jwt = require('jsonwebtoken');
require('dotenv').config()
const secretKey = process.env.JWT_SECRET;

// Function to generate a JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        secretKey,
        { expiresIn: '1h' } // Token expiration time
    );
};

// Middleware to verify a JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'No token provided.' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to authenticate token.' });
        }
        req.userId = decoded.id;
        next();
    });
};

module.exports = { generateToken, verifyToken };

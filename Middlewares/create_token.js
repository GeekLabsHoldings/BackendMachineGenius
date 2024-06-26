const jwt = require('jsonwebtoken');
require('dotenv').config()
const secretKey = process.env.JWT_SECRET;

// Function to generate a JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email , role: user.role},
        secretKey,
        { expiresIn: '1h' } // Token expiration time
    );
};


module.exports = { generateToken };

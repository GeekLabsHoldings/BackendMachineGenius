const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const path = require("path");
const mongoose = require("mongoose");
const cors = require('cors');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

// Enable static path for uploads
app.use('/uploads', express.static(path.join(__dirname, "uploads")));

// Middleware for parsing request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable CORS for specific origin
const corsOptions = {
    origin: 'https://machinegenius.io', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight requests handling

// Import routes files
const A_routes = require('./Routes/admin_routes');
const U_routes = require('./Routes/user_routes');
const T_routes = require('./Routes/task_routes');
const S_routes = require('./Routes/scrape_routes');
const g_routes = require('./Routes/generate_routes');
const c_routes = require('./Routes/checks_routes');
const comment_routes = require('./Routes/comment_routes');
const content_routes = require('./Routes/content_routes');

// Use routes
app.use('/', A_routes);
app.use('/', U_routes);
app.use('/', T_routes);
app.use('/', S_routes);
app.use('/', g_routes);
app.use('/', c_routes);
app.use('/', comment_routes);
app.use('/', content_routes);

// Start server on specified port from environment
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});

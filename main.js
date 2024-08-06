const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config()
const path = require("path")

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected to MongoDB")    
})


// enable static path
app.use('/uploads' , express.static(path.join(__dirname, "uploads")))

require('dotenv').config()


// Middleware for parsing request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//  enable CORS for all origins
const cors = require('cors')
const corsOptions = {
    origin: 'https://backendmachinegenius.onrender.com/transcript-audio', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight requests handling


// import routes file
const A_routes = require('./Routes/admin_routes')
const U_routes = require('./Routes/user_routes')
const T_routes = require('./Routes/task_routes')
const S_routes = require('./Routes/scrape_routes')
const g_routes = require('./Routes/generate_routes')
const c_routes = require('./Routes/checks_routes')
const comment_routes = require('./Routes/comment_routes')

app.use('/',A_routes)
app.use('/',U_routes)
app.use('/',T_routes)
app.use('/',S_routes)
app.use('/',g_routes)
app.use('/',c_routes)
app.use('/',comment_routes)

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.listen(3000, () => {
    console.log(`Server listening on http://localhost:${process.env.port}`);
});
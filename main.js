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
app.use(cors());


// import routes file
const S_routes = require('./Routes/scrape_routes')
const g_routes = require('./Routes/generate_routes')
const c_routes = require('./Routes/checks_routes')
const content_routes = require('./Routes/content_routes')

app.use('/',S_routes)
app.use('/',g_routes)
app.use('/',c_routes)
app.use('/',content_routes)

app.listen(3000, () => {
    console.log(`Server listening on http://localhost:${process.env.port}`);
});
const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config()
const app = express();

// Middleware for parsing request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//  enable CORS for all origins
const cors = require('cors')
app.use(cors());


// import routes file
const A_routes = require('./Routes/admin_routes')
const U_routes = require('./Routes/user_routes')
const T_routes = require('./Routes/task_routes')
const S_routes = require('./Routes/scrape_routes')
const g_routes = require('./Routes/generate_routes')

app.use('/',A_routes)
app.use('/',U_routes)
app.use('/',T_routes)
app.use('/',S_routes)
app.use('/',g_routes)

app.listen(process.env.port, () => {
    console.log(`Server listening on http://localhost:${process.env.port}`);
});
const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config()
const app = express();

// Middleware for parsing request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// import routes file
const A_routes = require('./Routes/admin_routes')
const U_routes = require('./Routes/user_routes')
const T_routes = require('./Routes/task_routes')

app.use('/',A_routes)
app.use('/',U_routes)
app.use('/',T_routes)


app.listen(process.env.port, () => {
    console.log(`Server listening on http://localhost:${process.env.port}`);
});
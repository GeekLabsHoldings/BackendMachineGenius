const express = require('express');
const bodyParser = require('body-parser');
const Controllers = require('./Controllers/user_controllers')
require('dotenv').config()

const app = express();
// const port = 3000;

// Middleware for parsing request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CRUD routes for User model
app.get('/users', Controllers.get_all_users);

app.get('/users/:id', Controllers.get_single_user);

app.post('/users', Controllers.register_new_user);

app.delete('/users/:id', Controllers.delete_user);

app.post('/login', Controllers.login);

// Start server
app.listen(process.env.port, () => {
    console.log(`Server listening on http://localhost:${process.env.port}`);
});

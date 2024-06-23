const express = require('express')
const router = express.Router()
const msg = "This module to handle the request and response of users"
const { verifyToken } = require("../Middlewares/verify_token");
const accessUser = require('../Middlewares/allowed_to');
const userRoles = require('../Utilites/user_roles')
// Require modules
const Controllers = require('../Controllers/user_controllers')



router.get('/users' , Controllers.get_all_users);
router.post('/users' , verifyToken , accessUser.allowedTo(userRoles.HR) , Controllers.register_new_user);
router.get('/users/:id', Controllers.get_single_user)
router.post('/user/login' , Controllers.login);
router.delete('/users/:id' , verifyToken , accessUser.allowedTo(userRoles.HR) , Controllers.delete_user);

module.exports = router;
module.exports.msg = msg
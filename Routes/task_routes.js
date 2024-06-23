const express = require('express')
const router = express.Router()
const msg = "This module to handle the request and response of tasks"
const { verifyToken } = require("../Middlewares/verify_token");
const accessUser = require('../Middlewares/allowed_to');
const userRoles = require('../Utilites/user_roles')

// Require modules
const Controllers = require('../Controllers/task_controller')

router.get('/tasks' , Controllers.get_all_tasks);
router.post('/tasks' ,  verifyToken , accessUser.allowedTo(userRoles.ADMIN) ,Controllers.add_new_task);
router.delete('/tasks/:id' ,  verifyToken , accessUser.allowedTo(userRoles.ADMIN) ,Controllers.delete_task);

module.exports = router
module.exports.msg = msg

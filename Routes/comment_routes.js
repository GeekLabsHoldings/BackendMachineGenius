const express = require('express')
const router = express.Router()
const msg = "This module to handle the request and response of comments"
const { verifyToken } = require("../Middlewares/verify_token");
const accessUser = require('../Middlewares/allowed_to');
const userRoles = require('../Utilites/user_roles')

// Require modules
const Controllers = require('../Controllers/commentsAndScript_controller')

router.get('/comments' , Controllers.get_all_comments);
router.post('/comments' ,  verifyToken , Controllers.add_new_comment);
router.delete('/comment/:id' ,  verifyToken , accessUser.allowedTo(userRoles.ADMIN) ,Controllers.delete_comment);

module.exports = router
module.exports.msg = msg

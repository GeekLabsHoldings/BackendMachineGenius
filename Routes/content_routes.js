const express = require('express')
const router = express.Router()
const msg = "This module to handle the request and response of content"
const { verifyToken } = require("../Middlewares/verify_token");
const accessUser = require('../Middlewares/allowed_to');
const userRoles = require('../Utilites/user_roles')
const contentControllers = require('../Controllers/Content Controller/content_controller')


router.get('/content', contentControllers.get_all_content);

router.post('/content', contentControllers.add_new_content);

router.patch('/content/:id', contentControllers.update_content);


module.exports = router

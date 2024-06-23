const express = require('express')
const router = express.Router()
const msg = "This module to handle the request and response of admins"
// Require modules
const Controllers = require('../Controllers/admin_controller')
const validate = require('../Validation/validate')

// const auth = require('../Middlewares/verify_token')

router.get('/admins' , Controllers.get_all_admins);
router.post('/admins' , Controllers.register_new_admin);
router.post('/login' , Controllers.login);

module.exports = router;
module.exports.msg = msg
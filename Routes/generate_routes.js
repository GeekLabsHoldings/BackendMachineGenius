const express = require('express')
const router = express.Router()
const msg = "This module to handle the request and response of AI generation model"

// Require modules
const generateConrollers = require('../Controllers/generate-content')

router.get('/generate-content', generateConrollers.generateContent);

module.exports = router;
module.exports.msg = msg
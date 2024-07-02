const express = require('express')
const router = express.Router()
const msg = "This module to handle the request and response of AI generation model"

// Require modules
const generateContent = require('../Controllers/generateContent_controller')

router.get('/generate-content', generateContent.generateContent);

module.exports = router;
module.exports.msg = msg
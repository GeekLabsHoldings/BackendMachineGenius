const express = require('express')
const router = express.Router()
const msg = "This module to handle the request and response of AI generation model"

// Require modules
const generateContent = require('../Controllers/generateContent_controller')
const finalizeContent = require('../Controllers/finalContent_controllers')

router.get('/generate-content', generateContent.generateContent);
router.post('/finalize-content', finalizeContent.generateContent);

module.exports = router;
module.exports.msg = msg
const express = require('express')
const router = express.Router()
const msg = "This module to handle the request and response of AI generation model"

// Require modules
const generateContent = require('../Controllers/OpenAi Controllers/generateContent_controller')
const finalizeContent = require('../Controllers/OpenAi Controllers/finalContent_controllers')
const grammarCheck = require('../Controllers/OpenAi Controllers/finalCheck_controller')

// router.get('/generate-content', generateContent.generateContent);
router.post('/generate-content', generateContent.generateContent);
router.post('/finalize-content', finalizeContent.generateContent);
router.post('/final-check', grammarCheck.check);

module.exports = router;
module.exports.msg = msg
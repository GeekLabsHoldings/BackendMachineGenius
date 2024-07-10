const express = require('express')
const router = express.Router()
const msg = "This module to handle the request and response of AI generation model"

// Require modules
const generateContent = require('../Controllers/OpenAi Controllers/generateContent_controller')
const finalizeINVContent = require('../Controllers/OpenAi Controllers/finalContentINV_controllers')
const finalizeSTPContent = require('../Controllers/OpenAi Controllers/finalContentSTP_controllers')
const grammarCheck = require('../Controllers/OpenAi Controllers/finalCheck_controller')

// router.get('/generate-content', generateContent.generateContent);
router.post('/generate-content', generateContent.generateContent);
router.post('/STP/finalize-content', finalizeSTPContent.generateContent);

//////////

router.post('/INV/finalize-content', finalizeINVContent.generateContent);
//////////
module.exports = router;
module.exports.msg = msg
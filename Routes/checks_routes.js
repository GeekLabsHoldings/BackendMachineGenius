const express = require('express')
const router = express.Router()
const msg = "This module to handle the request and response of checks models"

// Require modules
const checkAiContent = require('../Controllers/GPT-Zero Controller/AICheck_controller')
const checkGrammar = require('../Controllers/Sapling Controller/grammarcheck_controller')

router.post('/AI-check', checkAiContent.checkAi);
router.post('/grammar-check', checkGrammar.checkTextGrammar);

module.exports = router;
module.exports.msg = msg
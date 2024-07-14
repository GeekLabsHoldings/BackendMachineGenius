const express = require('express')
const router = express.Router()
const msg = "This module to handle the request and response of AI generation model"

// Require modules
const generateContent = require('../Controllers/OpenAi Controllers/generateContent_controller')
const finalizeScriptContent = require('../Controllers/OpenAi Controllers/scriptContent_controllers')
const finalizeArticleContent = require('../Controllers/OpenAi Controllers/articleContent_controllers')


router.post('/generate-content', generateContent.generateContent);


//////////
router.post('/script/finalize-content', finalizeScriptContent.generateContent);
router.post('/article/finalize-content', finalizeArticleContent.generateContent);
//////////
module.exports = router;
module.exports.msg = msg
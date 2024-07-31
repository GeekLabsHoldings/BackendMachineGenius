const multer = require('multer');
const express = require('express')
const router = express.Router()
const msg = "This module to handle the request and response of AI generation model"

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');  // Ensure the field name is 'file' lazem file m4 ay 7aga tanya
// Require modules
const generateContent = require('../Controllers/OpenAi Controllers/generateContent_controller')
const finalizeScriptContent = require('../Controllers/OpenAi Controllers/scriptContent_controllers')
const finalizeArticleContent = require('../Controllers/OpenAi Controllers/articleContent_controllers')
const generateTitles = require('../Controllers/OpenAi Controllers/generateTitles_controller')
const transcriptAudio = require('../Controllers/Free Convert Contollers/convertController')

router.post('/generate-content', generateContent.generateContent);

//////////
router.post('/script/finalize-content', finalizeScriptContent.generateContent);
router.post('/article/finalize-content', finalizeArticleContent.generateContent);
//////////
router.post('/generate-titles', generateTitles.generateContent);
//////////
router.post('/transcript-audio', upload , transcriptAudio.convertor);

module.exports = router;
module.exports.msg = msg
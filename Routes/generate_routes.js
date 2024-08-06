const multer = require('multer');
const express = require('express')
const router = express.Router()
const msg = "This module to handle the request and response of AI generation model"
const { verifyToken } = require("../Middlewares/verify_token");
const accessUser = require('../Middlewares/allowed_to');
const userRoles = require('../Utilites/user_roles')

// using multer 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req , file, cb) {
        const ext = file.mimetype.split('/')[1];
        // const fileType = file.mimetype.split('/')[0];    
    
        const fullName = "movie"+`.${ext}`;
        cb(null, fullName)   
    
    }
})

const filefilter = (req , file , cb) => {
    const fileType = file.mimetype.split('/')[0];
    if(fileType === "video")
    {
        return cb(null, true)
    }
    else
    {
        return cb(("This is an acceptable file type"), false)
    }
}
const upload = multer({ 
    storage: storage , 
    fileFilter: filefilter
})

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
router.get('/get-temp', finalizeScriptContent.get_all_temp);
//////////
router.post('/generate-titles', generateTitles.generateContent);
//////////
router.post('/transcript-audio', upload.single("file") , transcriptAudio.convertor);

module.exports = router;
module.exports.msg = msg

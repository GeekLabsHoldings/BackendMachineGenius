const express = require('express')
const router = express.Router()
const multer = require('multer')
const msg = "This module to handle the request and response of comments"
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
const Controllers = require('../Controllers/commentsAndScript_controller')

router.get('/comments' , Controllers.get_all_comments);
router.post('/comments' ,  verifyToken , Controllers.add_new_comment);
router.delete('/comment/:id' ,  verifyToken , accessUser.allowedTo(userRoles.ADMIN) ,Controllers.delete_comment);
////

router.post('/newcontent', upload.single("movie") , Controllers.add_new_content);


module.exports = router
module.exports.msg = msg

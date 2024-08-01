const { sequelize, Comment } = require("../Models/Comments/comment_model");
const { User } = require("../Models/Admins/admin_model");
const { Script } = require("../Models/Content/content_model");
const content_dataBase = require("../Models/Content/content_model");

const get_all_comments = async (req, res) => {
    const comments = await Comment.findAll();
        res.json(comments);
}

const add_new_content = async (req, res) => {
    const {content_title , content , brand , content_type} = req.body

    const content_exist = await content_dataBase.findOne({content_title : content_title});
    if(content_exist)
    {
        return res.status(400).send("content already exist")    
    }    

    const new_content = new content_dataBase ({
        content_title,
        content,
        brand ,
        content_type, 
        movie:req.file.filename
    })   

    await  new_content.save()
    .then(()=>{
        res.status(201).json(new_content)
    })
    .catch((error)=> {
        console.log(`${error}`)
        res.status(400).json({ message : 'There are '+ error})
    })    
};

const add_new_comment = async (req, res) => {
    try {
        const {admin_id, script_id, comment_content , author } = req.body;
        const script = await Script.findByPk(script_id);
        if(script)
        {
            const new_comment = await Comment.create({ admin_id, script_id , comment_content , author});
            res.status(201).json({ comment: new_comment});
        }
        else
        {
            res.status(404).json({ message: "No script found please select other script"});
        }
       
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const delete_comment = async (req, res) => {
    const comment = await Comment.findByPk(req.params.id);
    if (comment) {
        await Comment.destroy();
        res.json({ message: 'Task deleted' });
    } else {
        res.status(404).json({ message: 'Task not found' })
    }
}

module.exports =
{
    get_all_comments,
    add_new_comment,
    delete_comment,
    add_new_content
}
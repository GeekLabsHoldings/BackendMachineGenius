const comment_dataBase = require("../Models/Comments And Approvals/comment_modeljs");
const script_dataBase = require("../Models/Scripts/script_model");
const content_dataBase = require("../Models/Content/content_model");

const get_all_comments = async (req, res) => {
    const comments = await comment_dataBase.find({},{"__v" : false});
        res.json(comments);
}


const add_new_comment = async (req, res) => {
    try {
        const {admin_id, script_id, comment_content , author } = req.body;
        const script = await script_dataBase.findById(script_id , {"__v":false})
        if(script)
        {
            console.log("+");
            const new_comment = await comment_dataBase.create({ admin_id, script_id , comment_content , author});
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
    const comment_id = req.params.id;
    const result = await comment_dataBase.findByIdAndDelete(comment_id);
    if (result) {
        console.log("Product deleted successfully:", result);
        res.send({message:'The Product has been deleted Successfully'});
    } else {
        console.error("Product not found");
        res.status(404).send({message:"This product does not exist"});
    }
}

module.exports =
{
    get_all_comments,
    add_new_comment,
    delete_comment,
}
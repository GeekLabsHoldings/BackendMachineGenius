const { sequelize, Comment } = require("../Models/Comments/comment_model");

const get_all_comments = async (req, res) => {
    const comments = await Comment.findAll();
        res.json(comments);
}

const add_new_comment = async (req, res) => {
    try {
        const {admin_id, script_id, comment_content , author } = req.body;

        const new_comment = await Comment.create({ admin_id, script_id , comment_content , author});
        res.status(201).json({ comment: new_comment});
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
    delete_comment
}
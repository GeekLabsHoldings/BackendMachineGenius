const { sequelize, Task } = require("../Models/Tasks/task_model");

const get_all_tasks = async (req, res) => {
    const tasks = await Task.findAll();
        res.json(tasks);
}

const add_new_task = async (req, res) => {
    try {
        const { description, department } = req.body;

        // // Check if email already exists
        // const existing_user = await User.findOne({ where: { email } });
        // if (existing_user) {
        //     return res.status(400).json({ error: "Email already exists" });
        // }

        const new_task = await Task.create({ description, department });
        res.status(201).json({ task: new_task});
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const delete_task = async (req, res) => {
    const task = await Task.findByPk(req.params.id);
    if (task) {
        await task.destroy();
        res.json({ message: 'Task deleted' });
    } else {
        res.status(404).json({ message: 'Task not found' })
    }
}
module.exports =
{
    get_all_tasks,
    add_new_task,
    delete_task
}
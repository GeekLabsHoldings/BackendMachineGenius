const { sequelize, User } = require("../Models/Users/user_model");
const { sequelize_task, Task } = require("../Models/Tasks/task_model");
const { generateToken }= require("../Middlewares/create_token");


const get_all_users = async (req, res) => {
    const users = await User.findAll();
        res.json(users);
}

const register_new_user = async (req, res) => {
    try {
        const { email, password, department } = req.body;

        // Check if email already exists
        const existing_user = await User.findOne({ where: { email } });
        if (existing_user) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const new_user = await User.create({ email, password, department });
        const token = generateToken(new_user);
        res.status(201).json({ user: new_user, token });
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
const get_single_user = async (req, res) => {
    const user = await User.findByPk(req.params.id);
    const user_id = req.params.id
    const tasks = await Task.findAll({ where: { user_id } });
    if (user) {
        await user.update(req.body);
        res.json({
            user,
            tasks
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
    // console.log("Tasks:-" , tasks)
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        const message = "Loged in succcefully"
        if (!user || !user.checkPassword(password)) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
  
        const logged_in_token = generateToken(user);
        res.json({ message, logged_in_token });
    } catch (err) {
        // console.error("Error logging in user:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const delete_user = async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (user) {
        await user.destroy();
        res.json({ message: 'User deleted' });
    } else {
        res.status(404).json({ message: 'User not found' })
    }
}
module.exports =
{
    get_all_users,
    register_new_user,
    get_single_user,
    login,
    delete_user
}
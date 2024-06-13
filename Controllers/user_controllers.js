const { sequelize, User } = require("../DataBases/user_model");
// const bcrypt = require("bcryptjs");
// const jwt  = require('jsonwebtoken');
// const bodyParser = require('body-parser');
const { generateToken, verifyToken } = require("../Middlewares/auth");

const get_all_users = async (req, res) => {
    const users = await User.findAll();
        res.json(users);
}

const get_single_user = async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (user) {
        await user.update(req.body);
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
}

const register_new_user = async (req, res) => {
    // try {
        const { email, password, name } = req.body;

        // Check if email already exists
        const existing_user = await User.findOne({ where: { email } });
        if (existing_user) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const new_user = await User.create({ email, password, name });
        const token = generateToken(new_user);
        res.status(201).json({ user: new_user, token });
    // } catch (err) {
    //     console.error("Error registering user:", err);
    //     res.status(500).json({ error: "Internal Server Error" });
    // }
}
const login = async (req, res) => {
    // try {
        const { email, password } = req.body;
  
        const user = await User.findOne({ where: { email } });
        if (!user || !user.checkPassword(password)) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
  
        const token = generateToken(user);
        res.json({ user, token });
    // } catch (err) {
    //     // console.error("Error logging in user:", err);
    //     res.status(500).json({ error: "Internal Server Error" });
    // }
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
    get_single_user,
    register_new_user,
    delete_user,
    login
}
const { sequelize, User } = require("../Models/Admins/admin_model");
const { generateToken }= require("../Middlewares/create_token");

const get_all_admins = async (req, res) => {
    const users = await User.findAll();
        res.json(users);
}
const register_new_admin = async (req, res) => {
    try {
        const { email, password, name, department, role , theme } = req.body;

        // Check if email already exists
        const existing_user = await User.findOne({ where: { email } });
        if (existing_user) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const existing_theme = await User.findOne({ where: { theme } });
        if (existing_theme) {
            return res.status(400).json({ error: "Please Change the EPM. theme" });
        }
        // Create the user
        let new_user = await User.create({ email, password, name, department, role , theme});

        // Generate a token for the new user
        const token = generateToken(new_user);

        // Update the user with the token
        new_user.token = token;
        await new_user.save();

        // Send response with the new user data
        res.status(201).json({ user: new_user });
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
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
module.exports =
{
    get_all_admins,
    register_new_admin,
    login
}
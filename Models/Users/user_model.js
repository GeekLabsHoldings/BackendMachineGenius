const { Sequelize, Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
// Create Sequelize instance
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './DataBase/DataBases.sqlite'
});

// Define User model
class User extends Model 
{
    checkPassword(password)
    {
        return bcrypt.compareSync(password, this.password);
    }
}
User.init(
{
    email:
    {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: 
        {
            isEmail: true,
        }
    },
    password:
    {
        type: DataTypes.STRING,
        allowNull: false,
    },
    department:
    {
        type: DataTypes.STRING,
        allowNull: false,
    },
    theme:
    {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, 
{  sequelize,
    modelName: 'Users',
    hooks: 
    {
        beforeCreate: (user, options) => 
        {
            user.password = bcrypt.hashSync(user.password, 10);
        },
        beforeUpdate: (user, options) => 
        {
            if (user.changed('password')) {
                user.password = bcrypt.hashSync(user.password, 10);
            }
        }
    }
});

// Sync models with database
sequelize.sync()
    .then(() => console.log("Database synchronized"))
    .catch(err => console.error("Database sync error!:", err));

module.exports = { sequelize, User };
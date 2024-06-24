const { Sequelize, Model, DataTypes } = require('sequelize');
// const bcrypt = require('bcryptjs');
// Create Sequelize instance
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './DataBase/DataBases.sqlite'
});

// Define Task model
class Task extends Model 
{
    // checkPassword(password)
    // {
    //     return bcrypt.compareSync(password, this.password);
    // }
}

Task.init(
{
    user_id:
    {
        type: DataTypes.NUMBER,
        allowNull:true
    },
    description:
    {
        type: DataTypes.STRING,
        allowNull: false,
    },
    department:
    {
        type: DataTypes.STRING,
        allowNull: false,
    },
    progress:
    {
        type: DataTypes.STRING,
        allowNull:true
    }
}, 
{  sequelize,
    modelName: 'Taks',
    // hooks: 
    // {
    //     beforeCreate: (user, options) => 
    //     {
    //         user.password = bcrypt.hashSync(user.password, 10);
    //     },
    //     beforeUpdate: (user, options) => 
    //     {
    //         if (user.changed('password')) {
    //             user.password = bcrypt.hashSync(user.password, 10);
    //         }
    //     }
    // }
});
    
// Sync models with database
sequelize.sync()
    .then(() => console.log("Database synchronized"))
    .catch(err => console.error("Database sync error!:", err));

module.exports = { sequelize, Task };
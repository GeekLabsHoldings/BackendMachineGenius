const { Sequelize, Model, DataTypes } = require('sequelize');
// const bcrypt = require('bcryptjs');
// Create Sequelize instance
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './DataBase/DataBases.sqlite'
});

// Define Task model
class Task extends Model {}

Task.init({
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    department: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    progress: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Task'
});

    
// Sync models with database
sequelize.sync()
    .then(() => console.log("Database synchronized"))
    .catch(err => console.error("Database sync error!:", err));

module.exports = { sequelize, Task };
const { Sequelize, Model, DataTypes } = require('sequelize');
// const bcrypt = require('bcryptjs');
// Create Sequelize instance
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './DataBase/DataBases.sqlite'
});


class Comment extends Model {}

Comment.init({
    admin_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Admins',
            key: 'id'
        }
    },
    script_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Scripts',
            key: 'id'
        }
    },
    comment_content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Comment'
});


sequelize.sync()
    .then(() => console.log("Database synchronized"))
    .catch(err => console.error("Database sync error!:", err));

module.exports = { sequelize, Comment };
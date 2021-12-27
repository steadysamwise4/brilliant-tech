const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Commentblog extends Model {}

Commentblog.init(
  {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      comment_text: {
          type: DataTypes.STRING,
          allowNull: false, 
          validate: {
              len: [1]
          }
      },
      user_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'user',
            key: 'id'
          }
        },
      blog_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'blog',
            key: 'id'
          }
        }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'commentblog'
  }
);

module.exports = Commentblog;
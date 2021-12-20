const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Commentlink extends Model {}

Commentlink.init(
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
        link_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'link',
              key: 'id'
            }
          }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'commentlink'
  }
);

module.exports = Commentlink;
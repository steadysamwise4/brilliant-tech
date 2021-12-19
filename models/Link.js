const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/connection');

class Link extends Model {}

Link.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      link_url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      user_id: {
        type: DataTypes.UUID,
        references: {
          model: 'user',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      modelName: 'link'
    }
  );

  module.exports = Link;
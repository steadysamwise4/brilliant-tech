const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Votelink extends Model {}

Votelink.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'votelink'
  }
);

module.exports = Votelink;
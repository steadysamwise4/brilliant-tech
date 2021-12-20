const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/connection');

class Link extends Model {
  static upvote(body, models) {
    return models.Votelink.create({
      user_id: req.body.user_id,
      link_id: req.body.link_id,
    })
    .then(() => {
      // then find the link we just voted on
      return Link.findOne({
        where: {
          id: req.body.link_id
        },
        attributes: [
          'id',
          'link_url',
          'title',
          'description',
          'author',
          'created_at',
          // use raw MySQL aggregate function query to get a count of how many votes the post has and return it under the name `vote_count`
          [
            sequelize.literal('(SELECT COUNT(*) FROM votelink WHERE link.id = votelink.link_id)'),
            'vote_count'
          ]
        ]
      });
    });
  }
}

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
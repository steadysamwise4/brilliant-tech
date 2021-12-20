const { Model, DataTypes, Sequelize } = require('sequelize');
const User = require('./User');
const sequelize = require('../config/connection');

class Blog extends Model {
  static upvote(body, models) {
    return models.Voteblog.create({
      user_id: body.user_id,
      blog_id: body.blog_id
    })
    .then(() => {
        // then find the blog we just voted on
        return Blog.findOne({
          where: {
            id: body.blog_id
          },
          attributes: [
            'id',
            'title',
            'content',
            'created_at',
            // use raw MySQL aggregate function query to get a count of how many votes the post has and return it under the name `vote_count`
            [
              sequelize.literal('(SELECT COUNT(*) FROM voteblog WHERE blog.id = voteblog.blog_id)'),
              'vote_count'
            ]
          ],
          include: [
            {
              model: User,
              attributes: ['username']
            }
          ]
        });
    });
  }
}

Blog.init(
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
      content: {
        type: DataTypes.TEXT,
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
      modelName: 'blog'
    }
  );

  module.exports = Blog;
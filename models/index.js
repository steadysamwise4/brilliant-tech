const User = require('./User');
const Link = require("./Link");
const Blog = require("./Blog");

User.hasMany(Link, {
    foreignKey: 'user_id'
  });

  Link.belongsTo(User, {
    foreignKey: 'user_id',
  });

  User.hasMany(Blog, {
    foreignKey: 'user_id'
  });

  Blog.belongsTo(User, {
    foreignKey: 'user_id',
  }); 

module.exports = { User, Link, Blog };
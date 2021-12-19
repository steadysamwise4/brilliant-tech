const User = require('./User');
const Link = require("./Link");

User.hasMany(Link, {
    foreignKey: 'user_id'
  });

  Link.belongsTo(User, {
    foreignKey: 'user_id',
  });

module.exports = { User, Link };
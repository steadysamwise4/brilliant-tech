const User = require('./User');
const Link = require("./Link");
const Blog = require("./Blog");
const Voteblog = require('./Voteblog');
const Votelink = require('./Votelink');

User.hasMany(Link, {
    foreignKey: 'user_id'
});

Link.belongsTo(User, {
    foreignKey: 'user_id',
});

User.belongsToMany(Link, {
    through: Votelink,
    as: 'voted_links',
    foreignKey: 'user_id' 
});

Link.belongsToMany(User, {
    through: Votelink,
    as: 'voted_links',
    foreignKey: 'link_id'
});

User.hasMany(Blog, {
    foreignKey: 'user_id'
});

Blog.belongsTo(User, {
    foreignKey: 'user_id',
}); 

User.belongsToMany(Blog, {
    through: Voteblog,
    as: 'voted_blogs',
    foreignKey: 'user_id' 
});

Blog.belongsToMany(User, {
    through: Voteblog,
    as: 'voted_blogs',
    foreignKey: 'blog_id'
});

Votelink.belongsTo(User, {
    foreignKey: 'user_id'
  });
  
  Votelink.belongsTo(Link, {
    foreignKey: 'link_id'
  });
  
  User.hasMany(Votelink, {
    foreignKey: 'user_id'
  });
  
  Link.hasMany(Votelink, {
    foreignKey: 'link_id'
  });

  Voteblog.belongsTo(Blog, {
    foreignKey: 'blog_id'
  });

  Blog.hasMany(Voteblog, {
    foreignKey: 'blog_id'
  });



module.exports = { User, Link, Blog, Votelink, Voteblog };
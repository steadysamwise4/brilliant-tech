const User = require('./User');
const Link = require("./Link");
const Blog = require("./Blog");
const Voteblog = require('./Voteblog');
const Votelink = require('./Votelink');
const Commentblog = require('./Commentblog');
const Commentlink = require('./Commentlink');

User.hasMany(Link, {
    foreignKey: 'user_id'
});

Link.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: "CASCADE"
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
    onDelete: "CASCADE"
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

  Commentlink.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: "CASCADE"
  });
  
  Commentlink.belongsTo(Link, {
    foreignKey: 'link_id',
    onDelete: "CASCADE"
  });
  
  User.hasMany(Commentlink, {
    foreignKey: 'user_id',
    onDelete: "SET NULL"
  });
  
  Link.hasMany(Commentlink, {
    foreignKey: 'link_id',
    onDelete: 'SET NULL'
  });

  Commentblog.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: "CASCADE"
  });
  
  Commentblog.belongsTo(Blog, {
    foreignKey: 'blog_id',
    onDelete: "CASCADE"
  });
  
  User.hasMany(Commentblog, {
    foreignKey: 'user_id',
    onDelete: "SET NULL"
  });
  
  Blog.hasMany(Commentblog, {
    foreignKey: 'blog_id',
    onDelete: "SET NULL"
  });

module.exports = { User, Link, Blog, Votelink, Voteblog, Commentlink, Commentblog };
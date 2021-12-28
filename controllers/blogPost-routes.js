const router = require('express').Router();
const sequelize = require('../config/connection');
const { Blog, User, Commentblog } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', (req, res) => {
    Blog.findAll({
        attributes: ['id', 
                     'title', 
                     'content', 
                     'created_at',
                     [ sequelize.literal('(SELECT COUNT(*) FROM voteblog WHERE blog.id = voteblog.blog_id)'),
                      'vote_count'],
                      [ sequelize.literal('(SELECT COUNT(*) FROM commentblog WHERE blog.id = commentblog.blog_id)'),
                      'comment_count']
        ],
        include: [
            {
              model: Commentblog,
              attributes: ['id', 'comment_text', 'user_id', 'created_at'],
              include: {
                model: User,
                attributes: ['username']
              }
            },
            {
              model: User,
              attributes: ['username']
            }
          ]
    })
    .then(dbBlogData => {
        // pass a single post object into the homepage template
        const blogs = dbBlogData.map(blog => blog.get({ plain: true }));
        res.render('allblogs', { 
            blogs,
            loggedIn: true
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.get('/blog/:id', (req, res) => {
    Blog.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 
                     'title', 
                     'content',  
                     'created_at',
                     [ sequelize.literal('(SELECT COUNT(*) FROM voteblog WHERE blog.id = voteblog.blog_id)'),
                      'vote_count'],
                      [ sequelize.literal('(SELECT COUNT(*) FROM commentblog WHERE blog.id = commentblog.blog_id)'),
                      'comment_count']
        ],
        include: [
            {
              model: Commentblog,
              attributes: ['id', 'comment_text', 'blog_id', 'user_id', 'created_at'],
              include: {
                model: User,
                attributes: ['username']
              }
            },
            {
              model: User,
              attributes: ['username']
            }
          ]
    })
    .then(dbBlogData => {
        if (!dbBlogData) {
          res.status(404).json({ message: 'No blog found with this id' });
          return;
        }
  
        // serialize the data
        const blog = dbBlogData.get({ plain: true });
  
    res.render('single-blog', { 
        blog,
        loggedIn: req.session.loggedIn });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });


module.exports = router;


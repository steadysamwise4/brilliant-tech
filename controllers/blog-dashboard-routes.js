const router = require('express').Router();
const sequelize = require('../config/connection');
const { Blog, User, Commentblog } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
    Blog.findAll({
        where: {
            user_id: req.session.user_id
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
        // pass a single post object into the homepage template
        const blogs = dbBlogData.map(blog => blog.get({ plain: true }));
        res.render('blog-dashboard', { 
            blogs,
            loggedIn: true
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.get('/edit/:id', withAuth, (req, res) => {
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
              attributes: ['id', 'comment_text', 'link_id', 'user_id', 'created_at'],
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
        const blog = dbBlogData.get({ plain: true });
        res.render('edit-blogs', { 
            blog,
            loggedIn: true
        });
      })
});

module.exports = router;
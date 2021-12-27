const sequelize = require('../../config/connection');
const router = require('express').Router();
const { Blog, User, Voteblog, Commentblog } = require('../../models');

// get all blog posts
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
    .then(dbBlogData => res.json(dbBlogData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  });

  // Get one blog post by it's id
  router.get('/:id', (req, res) => {
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
          res.status(404).json({ message: 'No link found with this id' });
          return;
        }
        res.json(dbBlogData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  // create a new blog post
  router.post('/', (req, res) => {
    // expects {title: 'New coding challenges can seem overwhelming at first', 
    //content: 'When I just find a way to begin, at some point things start to click and it becomes fun.',
    // user_id: 1}
    Blog.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id
    })
      .then(dbBlogData => res.json(dbBlogData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

    // PUT /api/blogs/upvote - upvote this blog
router.put('/upvote', (req, res) => {
  if (req.session) {
    // custom static method created in models/Blog.js
    Blog.upvote({...req.body, user_id: req.session.user_id}, { Voteblog, Commentblog, User })
        .then(updatedVoteData => res.json(updatedVoteData))
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
      }
  });

  // update a blog post
  router.put('/:id', (req, res) => {
    Blog.update(
        {
            title: req.body.title,
            content: req.body.content
        },
        {
            where: {
                id: req.params.id 
            }
        }
    )
    .then (dbBlogData => {
        if (!dbBlogData) {
            res.status(404).json({ message: 'No blog found with this id' });
            return;
        }
        res.json(dbBlogData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// delete a blog post
router.delete('/:id', (req, res) => {
  Blog.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbBlogData => {
      if (!dbBlogData) {
        res.status(404).json({ message: 'No blog found with this id' });
        return;
      }
      res.json(dbBlogData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

  module.exports = router;
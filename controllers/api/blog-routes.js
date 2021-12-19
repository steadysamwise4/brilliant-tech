const sequelize = require('../../config/connection');
const router = require('express').Router();
const { Blog, User, Voteblog } = require('../../models');

// get all blog posts
router.get('/', (req, res) => {
    Blog.findAll({
        attributes: ['id', 
                     'title', 
                     'content', 
                     'created_at',
                     [ sequelize.literal('(SELECT COUNT(*) FROM voteblog WHERE blog.id = voteblog.blog_id)'),
                        'vote_count']
        ],
        include: [
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
                   'vote_count']
        ],
      include: [
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
      user_id: req.body.user_id
    })
      .then(dbBlogData => res.json(dbBlogData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

    // PUT /api/blogs/upvote - upvote this blog
router.put('/upvote', (req, res) => {
    Voteblog.create({
      user_id: req.body.user_id,
      blog_id: req.body.blog_id
    })
    .then(() => {
        // then find the blog we just voted on
        return Blog.findOne({
          where: {
            id: req.body.blog_id
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
        })
        .then(dbBlogData => res.json(dbBlogData))
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
      });
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
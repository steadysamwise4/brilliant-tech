const router = require('express').Router();
const { Blog, User } = require('../../models');

// get all blog posts
router.get('/', (req, res) => {
    Blog.findAll({
        attributes: ['id', 'title', 'content', 'created_at'],
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
      attributes: ['id', 'title', 'content', 'created_at'],
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
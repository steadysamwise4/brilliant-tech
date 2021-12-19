const sequelize = require('../../config/connection');
const router = require('express').Router();
const { Link, User, Votelink } = require('../../models');

// get all links
router.get('/', (req, res) => {
    Link.findAll({
        attributes: ['id', 'title', 'description', 'author', 'link_url', 'created_at'],
        include: [
            {
              model: User,
              attributes: ['username']
            }
          ]
    })
    .then(dbLinkData => res.json(dbLinkData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  });

  // Get one link by it's id
  router.get('/:id', (req, res) => {
    Link.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id', 'title', 'description', 'author', 'link_url', 'created_at'],
      include: [
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbLinkData => {
        if (!dbLinkData) {
          res.status(404).json({ message: 'No link found with this id' });
          return;
        }
        res.json(dbLinkData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  // create a posted link
  router.post('/', (req, res) => {
    // expects {title: 'The fundamentals of security incident response', 
    //description: 'Read about the ongoing battle between business and cybercriminals',
    // author: 'Chris Pratt', 
    // post_url: 'https://www.hpe.com', user_id: 1}
    Link.create({
      title: req.body.title,
      description: req.body.description,
      author: req.body.author,
      link_url: req.body.link_url,
      user_id: req.body.user_id
    })
      .then(dbLinkData => res.json(dbLinkData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  // PUT /api/links/upvote - upvote this link
router.put('/upvote', (req, res) => {
  Votelink.create({
    user_id: req.body.user_id,
    link_id: req.body.link_id,
  })
  .then(() => {
    // then find the post we just voted on
    return Link.findOne({
      where: {
        id: req.body.link_id
      },
      attributes: [
        'id',
        'link_url',
        'title',
        'description',
        'author',
        'created_at',
        // use raw MySQL aggregate function query to get a count of how many votes the post has and return it under the name `vote_count`
        [
          sequelize.literal('(SELECT COUNT(*) FROM votelink WHERE link.id = votelink.link_id)'),
          'vote_count'
        ]
      ]
    })
    .then(dbLinkData => res.json(dbLinkData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
  });
});

  // update a posted link
  router.put('/:id', (req, res) => {
    Link.update(
        {
            title: req.body.title,
            description: req.body.description,
            author: req.body.author,
            link_url: req.body.link_url 
        },
        {
            where: {
                id: req.params.id 
            }
        }
    )
    .then (dbLinkData => {
        if (!dbLinkData) {
            res.status(404).json({ message: 'No link found with this id' });
            return;
        }
        res.json(dbLinkData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// delete a link
router.delete('/:id', (req, res) => {
  Link.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbLinkData => {
      if (!dbLinkData) {
        res.status(404).json({ message: 'No link found with this id' });
        return;
      }
      res.json(dbLinkData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

  module.exports = router;
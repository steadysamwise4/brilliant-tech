const sequelize = require('../../config/connection');
const router = require('express').Router();
const { Link, User, Votelink, Commentlink } = require('../../models');

// get all links
router.get('/', (req, res) => {
    Link.findAll({
        attributes: ['id', 
                     'title', 
                     'description', 
                     'author', 
                     'link_url', 
                     'created_at',
                     [ sequelize.literal('(SELECT COUNT(*) FROM votelink WHERE link.id = votelink.link_id)'),
                      'vote_count'],
                      [ sequelize.literal('(SELECT COUNT(*) FROM commentlink WHERE link.id = commentlink.link_id)'),
                      'comment_count']
        ],
        include: [
            {
              model: Commentlink,
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
      attributes: ['id', 
                   'title', 
                   'description', 
                   'author', 
                   'link_url', 
                   'created_at',
                   [ sequelize.literal('(SELECT COUNT(*) FROM votelink WHERE link.id = votelink.link_id)'),
                      'vote_count'],
                   [ sequelize.literal('(SELECT COUNT(*) FROM commentlink WHERE link.id = commentlink.link_id)'),
                      'comment_count']
      ],
      include: [
        {
          model: Commentlink,
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
    // custom static method created in models/Link.js
    Link.upvote(req.body, { Votelink })
    .then(updatedLinkData => res.json(updatedLinkData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err); 
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
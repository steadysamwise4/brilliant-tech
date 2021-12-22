const router = require('express').Router();
const sequelize = require('../config/connection');
const { Link, User, Commentlink} = require('../models');

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
    .then(dbLinkData => {
        // pass a single post object into the homepage template
        const links = dbLinkData.map(link => link.get({ plain: true }));
        res.render('homepage', { links });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
      }
    res.render('signup');
  });

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
      }
    res.render('login');
  });

  router.get('/link/:id', (req, res) => {
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
  
        // serialize the data
        const link = dbLinkData.get({ plain: true });
  
    res.render('single-link', { link });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });


module.exports = router;
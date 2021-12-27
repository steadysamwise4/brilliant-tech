const router = require('express').Router();
const sequelize = require('../config/connection');
const { Link, User, Commentlink } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
    Link.findAll({
        where: {
            user_id: req.session.user_id
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
        // pass a single post object into the homepage template
        const links = dbLinkData.map(link => link.get({ plain: true }));
        res.render('dashboard', { 
            links,
            loggedIn: true
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.get('/edit/:id', withAuth, (req, res) => {
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
        const link = dbLinkData.get({ plain: true });

        res.render('edit-links', {
         link,
         loggedIn: true
        });
      })
})

module.exports = router;
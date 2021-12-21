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
        res.render('homepage', dbLinkData[0].get({ plain: true }));
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

module.exports = router;
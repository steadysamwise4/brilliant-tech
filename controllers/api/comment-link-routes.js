const router = require('express').Router();
const { Commentlink, User } = require('../../models');

router.get('/', (req, res) => {
    Commentlink.findAll({
        attributes: [
            'id',
            'comment_text',
            'created_at'
        ],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbCommentLinkData => res.json(dbCommentLinkData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
    if (req.session) {
    Commentlink.create({
        comment_text: req.body.comment_text,
        user_id: req.session.user_id,
        link_id: req.body.link_id
      })
        .then(dbCommentLinkData => res.json(dbCommentLinkData))
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    }
});

router.delete('/:id', (req, res) => {
    Commentlink.destroy({
        where: {
            id: req.params.id 
        }
    })
    .then(dbCommentLinkData => {
        if(!dbCommentLinkData) {
            res.status(404).json({ message: 'No comment found with this id'});
            return;
        }
        res.json(dbCommentLinkData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;
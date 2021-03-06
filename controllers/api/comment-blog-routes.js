const router = require('express').Router();
const { Commentblog, User} = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
    Commentblog.findAll({
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
    .then(dbCommentBlogData => res.json(dbCommentBlogData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/', withAuth, (req, res) => {
    if(req.session) {
    Commentblog.create({
        comment_text: req.body.comment_text,
        user_id: req.session.user_id,
        blog_id: req.body.blog_id
      })
        .then(dbCommentblogData => res.json(dbCommentblogData))
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    }
});

router.delete('/:id', withAuth,(req, res) => {
    Commentblog.destroy({
        where: {
            id: req.params.id 
        }
    })
    .then(dbCommentBlogData => {
        if(!dbCommentBlogData) {
            res.status(404).json({ message: 'No comment found with this id'});
            return;
        }
        res.json(dbCommentBlogData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;
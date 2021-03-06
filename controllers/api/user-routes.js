const router = require('express').Router();
const { User, Link, Blog, Votelink, Voteblog, Commentlink, Commentblog } = require('../../models');
const withAuth = require('../../utils/auth');

// GET /api/users
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
    console.log(err);
    res.status(500).json(err);
    });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
        id: req.params.id
        },
        include: [
            {
                model: Link,
                attributes: ['id', 'title', 'description', 'author', 'link_url', 'created_at']
            },
           {
            model: Blog,
            attributes: ['id', 'title', 'content', 'created_at']
           },
           {
            model: Commentlink,
            attributes: ['id', 'comment_text', 'created_at'],
            include: {
              model: Link,
              attributes: ['title']
            }
          },
          {
            model: Commentblog,
            attributes: ['id', 'comment_text', 'created_at'],
            include: {
              model: Blog,
              attributes: ['title']
            }
          },
            {
                model: Link,
                attributes: ['title'],
                through: Votelink,
                as: 'voted_links'
            },
            {
                model: Blog,
                attributes: ['title'],
                through: Voteblog,
                as: 'voted_blogs'
                
            }
        ]
    })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// POST /api/users
router.post('/', (req, res) => {
    // expects {username: 'aperson4', email: 'aperson4@gmail.com', password: 'password4321'}
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
  .then(dbUserData => {
    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.email = dbUserData.email;
      req.session.loggedIn = true;
  
      res.json(dbUserData);
    });
  })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// login route
router.post('/login', (req, res) => {
    // expects {email: 'lernantino@gmail.com', password: 'password1234'}
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(dbUserData => {
    if (!dbUserData) {
      res.status(400).json({ message: 'No user with that email address!' });
      return;
    }

    // res.json({ user: dbUserData });

    // Verify user
    const validPassword = dbUserData.checkPassword(req.body.password);
    if (!validPassword) {
        res.status(400).json({ message: 'Incorrect password!' });
        return;
      }
      req.session.save(() => {
        // declare session variables
        req.session.username = dbUserData.username;
        req.session.user_id = dbUserData.id;
        req.session.email = dbUserData.email;
        req.session.loggedIn = true;

      res.json({ user: dbUserData, message: 'You are now logged in!' });
    });
  });  
});

// PUT /api/users/1 - update a user's information
router.put('/:id', withAuth, (req, res) => {
    // expects {username: 'aperson4', email: 'aperson4@gmail.com', password: 'password4321'}
    User.update(req.body, {
        individualHooks: true,
        where: {
          id: req.params.id
        }
      })
        .then(dbUserData => {
          if (!dbUserData[0]) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
          }
          res.json(dbUserData);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });

});

// DELETE /api/users/1 - delete a user
router.delete('/:id', withAuth, (req, res) => {
    User.destroy({
        where: {
          id: req.params.id
        }
      })
        .then(dbUserData => {
          if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
          }
          res.json(dbUserData);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
});

router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  }
  else {
    res.status(404).end();
  }
});

module.exports = router;
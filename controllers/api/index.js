const router = require('express').Router();

const userRoutes = require('./user-routes.js');
const linkRoutes = require('./link-routes');
const blogRoutes = require('./blog-routes');

router.use('/users', userRoutes);
router.use('/links', linkRoutes);
router.use('/blogs', blogRoutes);

module.exports = router;
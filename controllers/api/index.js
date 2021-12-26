const router = require('express').Router();

const userRoutes = require('./user-routes.js');
const linkRoutes = require('./link-routes');
const blogRoutes = require('./blog-routes');
const commentLinkRoutes = require('./comment-link-routes');
const commentBlogRoutes = require('./comment-blog-routes');


router.use('/users', userRoutes);
router.use('/links', linkRoutes);
router.use('/blogs', blogRoutes);
router.use('/linkcomments', commentLinkRoutes);
router.use('/blogcomments', commentBlogRoutes);


module.exports = router;
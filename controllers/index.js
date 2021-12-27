const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./home-routes.js');
const dashboardRoutes = require('./dashboard-routes.js');
const blogPostRoutes = require('./blogPost-routes');
const blogDashRoutes = require('./blog-dashboard-routes');

router.use('/api', apiRoutes);
router.use('/', homeRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/allblogs', blogPostRoutes);
router.use('/blog-dashboard', blogDashRoutes);

router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;
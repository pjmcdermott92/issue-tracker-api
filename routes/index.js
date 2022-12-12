const express = require('express');
const router = express.Router();
const { protectRoute } = require('../middleware/auth');

router.use('/auth', require('./auth'));
router.use('/users', protectRoute, require('./users'));
router.use('/projects', protectRoute, require('./projects'));
router.use('/tickets', protectRoute, require('./tickets'));

module.exports = router;

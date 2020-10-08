const express = require('express');
const router = express.Router();

// @route GET api/profile
// @desc  profile Route
// @access Public
router.get('/', (req, res) => res.send('Profile Router'));

module.exports = router;
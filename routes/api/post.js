const express = require('express');
const router = express.Router();

// @route GET api/post
// @desc  post Route
// @access Public
router.get('/', (req, res) => res.send('Post Router'));

module.exports = router;
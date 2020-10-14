const { json } = require('express');
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const user = require('../../models/User');

// @route GET api/auth
// @desc  auth Route
// @access Public

// Note adding 'auth' in the route below will make protected!
router.get('/',auth, async (req, res) => {
    try {
        const userData = await user.findById(req.user.id);
        res.json(userData);
    } catch(err) {
        console.error(err.messages);
        res.status(500).send('Server Error');
    };
});

module.exports = router;
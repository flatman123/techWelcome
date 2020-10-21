const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route GET api/profile/me
// @desc  Get current user's profile
// @access Private
router.get('/me',auth, async (req, res) => {
   
    // Check for user profile AFTER they log in.
    try {
        const profile = await Profile.findOne({ userPro: req.user.id })
                                    .populate('userPro', ['name', 'avatar']);
        console.log(req.user.id)
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
                }
    } catch(err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
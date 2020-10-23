const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');

// @route GET api/profile/me
// @desc  Get current user's profile ( POST login )
// @access Private
router.get('/me',auth, async (req, res) => {
   
    // Check for user profile AFTER they log in.
    try {
        console.log(req.body.id)
        const profile = await Profile.findOne({ userPro: req.user.id })
                                    .populate('userPro', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
                }
    } catch(err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// @route POST api/profile/me
// @desc  Create or Update User Profile ( POST login )
// @access Private

router.post('/', [auth, [
    check('status', 'Status Is Required')
        .not()
        .isEmpty(),
    check('skills', 'Skills Is Required')
        .not()
        .isEmpty()    
]], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: 'Server Error' });
    };

    const {
       company,
       website,
       location,
       bio,
       status,
       skills,
       githubusername,
       youtube,
       facebook,
       twitter,
       instagram,
       linkedin
     } = req.body

     // Build profile object
     const profileFields = {};
     profileFields.user = req.user.id;
     if (company) profileFields.company = company;
     if (website) profileFields.website = website;
     if (location) profileFields.location = location;
     if (bio) profileFields.bio = bio;
     if (status) profileFields.status = status;
     if (skills) {
         profileFields.skills = skills.split(',')
                                      .map(skill => skill.trim())
     };

     // Check Skills Array
     console.log(skills)
     res.send('Fields were added JEff!')




});

module.exports = router;
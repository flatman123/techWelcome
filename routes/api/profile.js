const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config');
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
                                      .map(skill => skill.trim());
     };

     // Build Social Object
     profileFields.social = {};
     if (githubusername) profileFields.social.githubusername = githubusername;
     if (youtube) profileFields.social.youtube = youtube;
     if (twitter) profileFields.social.twitter = twitter;
     if (facebook) profileFields.social.facebook = facebook;
     if (linkedin) profileFields.social.linkedin = linkedin;
     if (instagram) profileFields.social.instagram = instagram;

     try {
        let profile = await Profile.findOne({ user: req.user.id });

        // Update Profile
        if(profile) {
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true, useFindAndModify: false }
            );
            return res.json(profile);
        };
        
        // Create Profile
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);

     } catch(err) {
         console.error(err.message.indexOf );
         res.status(500).send('Server Error');
     }
});


// GET /api/profile/
// desc Get all profiles
// @Access Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find({}).populate('user',['avatar','name']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    };
});



// GET /api/profile/
// desc Get user profile via id
// @Access Public
router.get('/user/:userID', async (req, res) => {
    try {
        const userProfile = await Profile.findOne({ user: req.params.userID });
        if (!userProfile) {
            return res.status(400).json({ msg: 'User Does Not Exist' });
        };
        res.json(userProfile);
    } catch (err) {
        if ( err.kind === 'ObjectId' ) {
            return res.status(400).json({ msg: 'User Does Not Exist' });
        };

        res.status(500).json({ msg: 'Server Error' });
    };
});


// DELETE /api/profile/
// desc Delete profile, user and posts
// @Access private
router.delete('/',auth, async (req, res) => {
    try {
        // @todo - remove user posts

        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });

        // Remove User
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    };
});


// PUT /api/profile/experience
// desc Add profile experience
// @Access private
router.put('/experience', [ auth, [
    check('title', 'Title is required')
        .not()
        .isEmpty(),
    check('company', 'Sorry, company is required')
        .not()
        .isEmpty(),
    check('from', 'From date is required')
        .not()
        .isEmpty()
]], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()){
        return res.status(400).json({ error: errors.array() });
    };

    // Build Experience Object
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const usrExperience = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.experience.unshift(usrExperience);
        await profile.save();
        
        res.json(profile);
    } catch(err) {
        console.error(error.message);
        res.status(500).send({ msg: 'Server Error' });
    };

});

// DELETE /api/profile/experience/:exp_id
// desc Delete an experience
// @Access private
router.delete('/experience/:exp_id', auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // Remove an experience
        const expIndex = profile.experience
            .map(exp => exp.id)
            .indexOf(req.params.exp_id);

        if (expIndex < 0) {
            return res.status(400).json({ msg: 'Server Error' });
        };

        profile.experience.splice(expIndex, 1);        
        await profile.save();
        res.json(profile);

    } catch (err){
        console.error(err.message);
        res.status(500).send({ msg: 'Server Error' });
    }
});


// PUT /api/education/
// @desc Add education to user profile
// @Access private
router.put('/education', [auth,
    check('school', 'School is required')
        .not()
        .isEmpty(),
    check('degree', 'You must enter a degree')
        .notEmpty(),
    check('from', 'From data is required')
        .notEmpty(),
    check('to', 'To date is required')
        .notEmpty(),
    check('fieldOfStudy', 'Field of study is required')
        .notEmpty()
    ], 
    async(req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.errors })
        };
    
    // Build Education object
    const {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
    } = req.body;

    const userEducation = {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
    };

    try{
        const profile = await Profile.findOne({ user: req.user.id });

        // Add user education to their profile
        profile.education.unshift(userEducation);
    
        await profile.save(profile);
        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    };
});


// DELETE /api/education/edu_id
// @desc Delete education from user profile
// @Access private
router.delete('/education/:edu_id', auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const eduIndex = profile.education
                                .map(edu => edu.id)
                                .indexOf(req.params.edu_id);
        if (eduIndex < 0) {
            return res.status(400).json({ msg: 'Server Error' });
        };         

        profile.education.splice(eduIndex, 1);
        await profile.save();
        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    };
});


// GET /api/profile/github/:username
// @desc Get user repos from Github
// @Access public
router.get('/github/:username', (req, res) => {
    try {
        console.log(config.get('gitHubClientSecret'));
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/ \
                    repos?per_page=5&sort=created:asc&client_id=${config.get('gitHubClientID')}& \
                    client_secret=${config.get('gitHubClientSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'redeyecoding' }
        };

        request(options, (error, response, body) => {

            if (error) console.error(error);
            if (response.statusCode !== 200) {
                return res.status(response.statusCode).json({ msg: 'No Github profile found!'});
            };

            res.json(JSON.parse(body));

        });
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    };
});




module.exports = router;
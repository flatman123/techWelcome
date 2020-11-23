const mongoose = require('mongoose');
const auth = require('../../middleware/auth');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');


// POST /api/posts
// Add a post 
// @Private
router.post('/', [
    auth,
    check('text', 'Text is required to create a post.')
        .not()
        .isEmpty()
    ], async(req, res)=> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    };

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    };

});

module.exports = router;
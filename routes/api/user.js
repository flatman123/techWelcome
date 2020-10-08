const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');



// @route GET api/users
// @desc  Register User
// @access Public
router.post('/', 
    //Validate User Input
    [
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'A Valid email address is required!').isEmail(),
    check('password', 'Enter password with more than 5 characters!')
        .isLength({min: 6})
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        // console.log(`Here are the errors sent ${errors}`);

        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        };

        const { name, email, password } = req.body;

        try {
            // Check if user exits
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ 
                    errors: [{msg: 'Hey, that user already exists!'}] 
                });
            };
            
            /// CREATE USER

            // Get user gravatar
            const avatar = gravatar.url(email,{
                s: '200',
                r: 'pg',
                d: 'mm'
            });

            user = new User({
                name,
                email,
                avatar,
                password
            });

            // Encypt User password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);


            // Save User to database
            await user.save();

            // Return jsonwebtoken
            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                {expiresIn: 360000},
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );

        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;
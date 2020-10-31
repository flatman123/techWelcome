const { json } = require('express');
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config')



// @route GET api/auth
// @desc  auth Route
// @access Public

// Note adding 'auth' in the route below will make protected!
router.get('/',auth, async (req, res) => {
    try {
        const userData = await User.findById(req.user.id).select('-password');
        res.json(userData);
    } catch(err) {
        console.error(err.messages);
        res.status(500).send('Server Error');
    };
});


// @route POST api/auth
// @desc  Login User
// @access Public ( Its public so you can get the token so they can have access
    // to and make requests to private routes. )

router.post('/', 
    //Validate User Input
    [
    check('email', 'A Valid email address is required!').isEmail(),
    check('password', 'Password Is Required.')
        .exists()
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        // console.log(`Here are the errors sent ${errors}`);

        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        };

        const { email, password } = req.body;

        try {
            // Check if user exits
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ 
                    errors: [{msg: 'Invalid Credentials'}] 
                });
            };

            // Validate user password

            const pwdIsMatch = await bcrypt.compare(password, user.password);

            if (!pwdIsMatch) {
                return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }]})
            }

            // THIS LINE OF CODE WAS ONLY USED FOR TESTING PURPOSES **COMMENTED OUT**
            // } else {
            //     return res.status(200).json({ msg : 'CREDENTIALS ARE VALID!!' });
            // }

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
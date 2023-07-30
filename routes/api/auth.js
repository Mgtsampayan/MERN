const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require("express-validator");

const Users = require('../../models/User');


// routes GET api/auth
// desc   Test route
// access Public

router.get('/', auth, async (req, res) => {
    try {
        const user = await Users.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// routes GET api/users
// desc   Test route
// access Public

router.post(
    "/",
    [
        check(
            "password",
            "Please Enter a Password with 6 or more characters"
        ).exists(),
        check("email", "Email is Required").isEmail(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { password, email } = req.body;

        try {
            let user = await Users.findOne({ email });

            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Please Try your Email Again! ' }] });
            }

            const Match = await bcrypt.compare(password, user.password);
            if (!Match) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Please Try your Password Again! ' }] });
            }

            // Return jsonwebtoken or other response if needed
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload, config.get('jwtSecret'),
                // Optional but for Secure you need to input the expiration
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                });
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Server error");
        }
    }
);
module.exports = router
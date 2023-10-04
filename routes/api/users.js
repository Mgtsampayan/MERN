const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

// Register a new user
router.post(
    "/",
    [
        check("name", "Name is required").not().isEmpty(),
        check("password", "Password must be at least 6 characters long").isLength({ min: 6 }),
        check("email", "Please provide a valid email").isEmail(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, password, email } = req.body;

        try {
            let user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({ errors: [{ msg: "User already exists" }] });
            }

            // Use Gravatar
            const avatar = gravatar.url(email, {
                s: "200",
                r: "pg",
                d: "mm",
            });

            user = new User({
                name,
                email,
                avatar,
                password,
            });
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();

            // Return jsonwebtoken and success message
            const payload = {
                user: {
                    id: user.id,
                },
            };

            jwt.sign(
                payload,
                config.get("jwtSecret"),
                // Optional but for security, you can set the expiration
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token, msg: "User registered successfully" });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ errors: [{ msg: "Server error" }] });
        }
    }
);

module.exports = router;

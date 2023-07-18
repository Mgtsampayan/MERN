const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');

// routes GET api/users
// desc   Test route
// access Public

router.post("/", [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('password', 'Please Enter a Password with 6 or more characters').isLength({min: 6})
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }
    res.send(`User route`)
});

module.exports = router;
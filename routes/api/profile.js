const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile')
const auth = require('../../middleware/auth');
const User = require('../../models/User')

// routes GET api/profile
// desc   Test route
// access Public

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate(
            'user',
            ['name', 'avatar'
            ]);
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this User' });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router
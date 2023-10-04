const express = require('express');
const router = express.Router();
const Payday = require('../../models/Payday');
const auth = require('../../middleware/auth');

// Create a new payday entry
router.post('/', auth, async (req, res) => {
    try {
        const { date, description } = req.body;
        const newPayday = new Payday({
            date,
            description,
            user: req.user.id, // Associate the payday entry with the authenticated user
        });
        const savedPayday = await newPayday.save();
        res.json(savedPayday);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all payday entries
router.get('/', async (req, res) => {
    try {
        const paydays = await Payday.find().populate('user', '-password'); // Populate user information in the response
        res.json(paydays);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a payday entry by ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { date, description } = req.body;
        const updatedPayday = await Payday.findByIdAndUpdate(id, { date, description }, { new: true });
        res.json(updatedPayday);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a payday entry by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Payday.findByIdAndRemove(id);
        res.json({ message: 'Payday deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

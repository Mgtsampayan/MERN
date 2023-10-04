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
router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { date, description } = req.body;
        
        // Find the payday entry by ID and check if the authenticated user owns it
        const payday = await Payday.findById(id);
        
        if (!payday) {
            return res.status(404).json({ error: 'Payday not found' });
        }

        // Check if the authenticated user owns this payday entry
        if (payday.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized: You do not own this payday entry' });
        }

        const updatedPayday = await Payday.findByIdAndUpdate(id, { date, description }, { new: true });
        res.json(updatedPayday);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a payday entry by ID
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the payday entry by ID and check if the authenticated user owns it
        const payday = await Payday.findById(id);
        
        if (!payday) {
            return res.status(404).json({ error: 'Payday not found' });
        }

        // Check if the authenticated user owns this payday entry
        if (payday.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized: You do not own this payday entry' });
        }

        await Payday.findByIdAndRemove(id);
        res.json({ message: 'Payday deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

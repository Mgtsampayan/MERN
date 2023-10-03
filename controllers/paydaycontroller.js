const moment = require('moment');
const Payday = require('../models/Paydaymodels');

// Calculate the next Payday and running countdown
const calculateNextPayday = (req, res) => {
    // Determine the current date
    const currentDate = moment();

    // Define the Payday dates (14th and 29th)
    const firstPayday = moment({ day: 14 });
    const secondPayday = moment({ day: 29 });

    // Check if the current date is on or after the second Payday
    if (currentDate.isSameOrAfter(secondPayday)) {
        // If it's after the second Payday, calculate the next first Payday
        firstPayday.add(1, 'months');
        secondPayday.add(1, 'months');
    }

    // Check if the current date is on or after the first Payday
    if (currentDate.isSameOrAfter(firstPayday)) {
        // If it's after the first Payday, calculate the next second Payday
        secondPayday.add(1, 'months');
    }

    // Calculate the number of days until the next Payday
    const daysUntilNextPayday = secondPayday.diff(currentDate, 'days');

    // Create or update a Payday document in the database
    const Payday = new Payday({
        date: secondPayday.format('YYYY-MM-DD'),
    });

    Payday.save()
        .then(() => {
            // Respond with the next Payday date and the countdown
            res.json({
                success: true,
                nextPaydayDate: secondPayday.format('YYYY-MM-DD'),
                countdownDays: daysUntilNextPayday,
            });
        })
        .catch(err => res.status(500).json({ success: false, error: err.message }));
};


// Get all Payday dates
const getAllPaydays = (req, res) => {
    Payday.find()
        .then(Paydays => res.json(Paydays))
        .catch(err => res.status(500).json({ success: false, error: err.message }));
};

// Get a specific Payday by ID
const getPaydayById = (req, res) => {
    Payday.findById(req.params.id)
        .then(Payday => {
            if (!Payday) {
                return res.status(404).json({ success: false, message: 'Payday not found' });
            }
            res.json(Payday);
        })
        .catch(err => res.status(500).json({ success: false, error: err.message }));
};

// Update a specific Payday by ID
const updatePaydayById = (req, res) => {
    Payday.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(Payday => {
            if (!Payday) {
                return res.status(404).json({ success: false, message: 'Payday not found' });
            }
            res.json(Payday);
        })
        .catch(err => res.status(500).json({ success: false, error: err.message }));
};

// Delete a specific Payday by ID
const deletePaydayById = (req, res) => {
    Payday.findByIdAndRemove(req.params.id)
        .then(Payday => {
            if (!Payday) {
                return res.status(404).json({ success: false, message: 'Payday not found' });
            }
            res.json({ success: true, message: 'Payday deleted' });
        })
        .catch(err => res.status(500).json({ success: false, error: err.message }));
};

module.exports = {
    calculateNextPayday,
    getAllPaydays,
    getPaydayById,
    updatePaydayById,
    deletePaydayById,
};

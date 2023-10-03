const express = require('express');
const router = express.Router();
const paydayController = require('../../controllers/paydaycontroller');

// Define routes
router.get('/', paydayController.getAllPaydays);
router.get('/:id', paydayController.getPaydayById);
router.post('/', paydayController.calculateNextPayday);
router.put('/:id', paydayController.updatePaydayById);
router.delete('/:id', paydayController.deletePaydayById);

module.exports = router;
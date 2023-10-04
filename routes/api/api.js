const express = require('express');
const router = express.Router();
const paydayController = require('../controllers/paydayController');

// Create a new employee
router.post('/employee', paydayController.createEmployee);

// Get all employees
router.get('/employees', paydayController.getAllEmployees);

// Get a single employee by ID
router.get('/employee/:id', paydayController.getEmployeeById);

// Update an employee by ID
router.put('/employee/:id', paydayController.updateEmployeeById);

// Delete an employee by ID
router.delete('/employee/:id', paydayController.deleteEmployeeById);

module.exports = router;

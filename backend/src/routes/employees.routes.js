const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const { authorize } = require('../middleware/auth');

router.get('/', authorize(['admin']), employeeController.getEmployees);

module.exports = router;

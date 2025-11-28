const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { authorize } = require('../middleware/auth');
const { body, param } = require('express-validator');

const taskValidation = [
  body('title').isString().isLength({ min: 1 }).withMessage('Title is required'),
  body('employeeId').isMongoId().withMessage('employeeId must be a valid id'),
  body('status').optional().isIn(['pending', 'in-progress', 'completed']),
];

const updateValidation = [
  param('id').isMongoId().withMessage('Invalid task id'),
  body('title').optional().isString(),
  body('employeeId').optional().isMongoId(),
  body('status').optional().isIn(['pending', 'in-progress', 'completed']),
];

router.get('/', taskController.getTasks);
router.post('/', authorize(['admin']), taskValidation, taskController.createTask);
router.put('/:id', authorize(['admin']), updateValidation, taskController.updateTask);

module.exports = router;

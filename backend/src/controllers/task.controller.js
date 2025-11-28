const Task = require('../models/task.model');
const Employee = require('../models/employee.model');
const { validationResult } = require('express-validator');

exports.getTasks = async (req, res, next) => {
  try {
    const { employeeId, status } = req.query;
    const filter = {};
    
    // If user is employee, only show their tasks
    if (req.user.role === 'employee') {
      filter.employeeId = req.user.employeeId;
    } else if (employeeId) {
      // Admin can filter by specific employee
      filter.employeeId = employeeId;
    }
    
    if (status) filter.status = status;

    const tasks = await Task.find(filter).populate('employeeId', 'name').sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, description, status, employeeId } = req.body;
    // ensure employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(400).json({ message: 'Invalid employeeId' });

    const task = new Task({ title, description, status, employeeId });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { id } = req.params;
    const { title, description, status, employeeId } = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (employeeId) {
      const employee = await Employee.findById(employeeId);
      if (!employee) return res.status(400).json({ message: 'Invalid employeeId' });
      task.employeeId = employeeId;
    }
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    await task.save();
    res.json(task);
  } catch (err) {
    next(err);
  }
};

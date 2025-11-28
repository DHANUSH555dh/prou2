const Employee = require('../models/employee.model');
const Task = require('../models/task.model');

exports.getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().lean();
    // include task counts
    const employeesWithCounts = await Promise.all(
      employees.map(async (emp) => {
        const count = await Task.countDocuments({ employeeId: emp._id });
        return { ...emp, taskCount: count };
      })
    );
    res.json(employeesWithCounts);
  } catch (err) {
    next(err);
  }
};

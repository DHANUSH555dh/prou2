const Task = require('../models/task.model');
const Employee = require('../models/employee.model');

exports.getDashboard = async (req, res, next) => {
  try {
    const filter = {};
    
    // If user is employee, only show their task stats
    if (req.user.role === 'employee') {
      filter.employeeId = req.user.employeeId;
    }

    const totalTasks = await Task.countDocuments(filter);
    const completed = await Task.countDocuments({ ...filter, status: 'completed' });
    const inProgress = await Task.countDocuments({ ...filter, status: 'in-progress' });
    const pending = await Task.countDocuments({ ...filter, status: 'pending' });
    const completionRate = totalTasks === 0 ? 0 : Math.round((completed / totalTasks) * 100);

    // Get additional stats for admins
    let additionalStats = {};
    if (req.user.role === 'admin') {
      // Tasks per employee
      const tasksPerEmployee = await Task.aggregate([
        {
          $group: {
            _id: '$employeeId',
            taskCount: { $sum: 1 },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
          }
        },
        {
          $lookup: {
            from: 'employees',
            localField: '_id',
            foreignField: '_id',
            as: 'employee'
          }
        },
        {
          $unwind: '$employee'
        },
        {
          $project: {
            employeeName: '$employee.name',
            taskCount: 1,
            completed: 1,
            completionRate: { 
              $round: [{ $multiply: [{ $divide: ['$completed', '$taskCount'] }, 100] }, 0] 
            }
          }
        }
      ]);

      // Recent task activity (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentActivity = await Task.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            tasksCreated: { $sum: 1 },
            tasksCompleted: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      additionalStats = {
        tasksPerEmployee,
        recentActivity,
        totalEmployees: await Employee.countDocuments()
      };
    }

    res.json({ 
      totalTasks, 
      completed, 
      inProgress, 
      pending, 
      completionRate,
      ...additionalStats
    });
  } catch (err) {
    next(err);
  }
};

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Employee = require('../src/models/employee.model');
const Task = require('../src/models/task.model');
const User = require('../src/models/user.model');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/employee_tasks_db';

async function seed() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to DB for seeding');

  // Clear existing data
  await Task.deleteMany({});
  await Employee.deleteMany({});
  await User.deleteMany({});

  // Create employees
  const employees = await Employee.create([
    { name: 'Alice Johnson' },
    { name: 'Bob Smith' },
    { name: 'Carol Davis' },
  ]);

  // Create demo users
  const users = await User.create([
    {
      name: 'Admin User',
      email: 'admin@demo.com',
      password: 'password123',
      role: 'admin',
    },
    {
      name: 'Alice Johnson',
      email: 'employee@demo.com',
      password: 'password123',
      role: 'employee',
      employeeId: employees[0]._id,
    },
    {
      name: 'Bob Smith',
      email: 'bob@demo.com',
      password: 'password123',
      role: 'employee',
      employeeId: employees[1]._id,
    },
  ]);

  // Create tasks
  const tasks = [
    { title: 'Prepare monthly report', description: 'Compile the monthly sales report', status: 'in-progress', employeeId: employees[0]._id },
    { title: 'Deploy release', description: 'Deploy v1.2.0 to production', status: 'pending', employeeId: employees[1]._id },
    { title: 'Fix login bug', description: 'Resolve 500 on login', status: 'completed', employeeId: employees[0]._id },
    { title: 'Design landing page', description: 'Create hero section', status: 'pending', employeeId: employees[2]._id },
    { title: 'Update documentation', description: 'Update API documentation', status: 'completed', employeeId: employees[1]._id },
    { title: 'Setup CI/CD pipeline', description: 'Configure automated deployment', status: 'in-progress', employeeId: employees[0]._id },
    { title: 'Code review', description: 'Review pull requests', status: 'pending', employeeId: employees[2]._id },
  ];

  await Task.create(tasks);
  
  console.log('Seed data created successfully!');
  console.log('Demo accounts:');
  console.log('Admin: admin@demo.com / password123');
  console.log('Employee: employee@demo.com / password123');
  console.log('Employee 2: bob@demo.com / password123');
  
  mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

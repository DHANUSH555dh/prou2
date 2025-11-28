const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth.routes');
const employeesRouter = require('./routes/employees.routes');
const tasksRouter = require('./routes/tasks.routes');
const dashboardRouter = require('./routes/dashboard.routes');
const { authenticate } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Public routes
app.get('/', (req, res) => res.json({ 
  message: 'Employee Task Tracker API',
  version: '2.0.0',
  features: ['Authentication', 'Role-based Access', 'Advanced Dashboard']
}));
app.use('/api/auth', authRouter);

// Protected routes
app.use('/api/employees', authenticate, employeesRouter);
app.use('/api/tasks', authenticate, tasksRouter);
app.use('/api/dashboard', authenticate, dashboardRouter);

app.use(errorHandler);

module.exports = app;

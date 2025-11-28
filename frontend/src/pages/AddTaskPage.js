import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiUser, FiFileText, FiTag, FiArrowLeft } from 'react-icons/fi';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Card, Button, LoadingSpinner } from '../components/UI';
import toast from 'react-hot-toast';

export default function AddTaskPage() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    employeeId: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get('/employees');
        setEmployees(response.data);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
        toast.error('Failed to load employees');
      } finally {
        setLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/tasks', formData);
      toast.success('Task created successfully!');
      navigate('/tasks');
    } catch (error) {
      console.error('Failed to create task:', error);
      const message = error.response?.data?.message || 'Failed to create task';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'text-yellow-600' },
    { value: 'in-progress', label: 'In Progress', color: 'text-blue-600' },
    { value: 'completed', label: 'Completed', color: 'text-green-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/tasks')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <FiPlus className="h-8 w-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Task</h1>
            <p className="text-gray-600">Add a new task and assign it to a team member</p>
          </div>
        </div>

        {/* Main Form Card */}
        <Card className="p-8 shadow-lg border-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Task Title */}
            <div>
              <label htmlFor="title" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FiFileText className="mr-2 h-4 w-4" />
                Task Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter a descriptive task title..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors duration-200"
              />
            </div>

            {/* Task Description */}
            <div>
              <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FiFileText className="mr-2 h-4 w-4" />
                Description
                <span className="ml-2 text-xs text-gray-500">(Optional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Provide additional details about the task..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors duration-200 resize-none"
              />
            </div>

            {/* Status and Employee Assignment Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Selection */}
              <div>
                <label htmlFor="status" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FiTag className="mr-2 h-4 w-4" />
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white transition-colors duration-200"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Employee Assignment */}
              <div>
                <label htmlFor="employeeId" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FiUser className="mr-2 h-4 w-4" />
                  Assign to Employee
                </label>
                <select
                  id="employeeId"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                  disabled={loadingEmployees}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {loadingEmployees ? 'Loading employees...' : 'Select an employee'}
                  </option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} ({emp.taskCount || 0} tasks)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 space-y-4 space-y-reverse sm:space-y-0">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/tasks')}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  disabled={loadingEmployees || !formData.title || !formData.employeeId}
                  className="w-full sm:w-auto inline-flex items-center"
                >
                  <FiPlus className="mr-2 h-4 w-4" />
                  Create Task
                </Button>
              </div>
            </div>
          </form>

          {/* Loading State */}
          {loadingEmployees && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
              <div className="flex items-center space-x-3">
                <LoadingSpinner size="md" />
                <span className="text-gray-600">Loading employees...</span>
              </div>
            </div>
          )}
        </Card>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Tasks will be visible to the assigned employee in their dashboard.{' '}
            <span className="text-primary-600 font-medium">Only admins can create tasks.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
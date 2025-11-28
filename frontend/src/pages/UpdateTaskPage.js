import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiEdit3, FiSave, FiX, FiArrowLeft } from 'react-icons/fi';
import api from '../api/api';
import { Card, Button, LoadingSpinner, Skeleton } from '../components/UI';
import toast from 'react-hot-toast';

export default function UpdateTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    employeeId: '',
    priority: 'medium'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, taskRes] = await Promise.all([
          api.get('/employees'),
          api.get(`/tasks?_id=${id}`)
        ]);
        
        setEmployees(empRes.data);
        const task = taskRes.data.find(t => t._id === id);
        
        if (task) {
          setFormData({
            title: task.title || '',
            description: task.description || '',
            status: task.status || 'pending',
            employeeId: task.employeeId?._id || task.employeeId || '',
            priority: task.priority || 'medium'
          });
        } else {
          toast.error('Task not found');
          navigate('/tasks');
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to load task details');
        navigate('/tasks');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Task title is required');
      return;
    }
    
    if (!formData.employeeId) {
      toast.error('Please select an employee');
      return;
    }

    setSaving(true);
    
    try {
      await api.put(`/tasks/${id}`, formData);
      toast.success('Task updated successfully!');
      navigate('/tasks');
    } catch (error) {
      console.error('Update failed:', error);
      toast.error(error.response?.data?.message || 'Failed to update task');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    navigate('/tasks');
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <Card className="p-8">
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <FiEdit3 className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Task</h1>
        <p className="text-gray-600">
          Modify task details and reassign as needed to keep your team on track.
        </p>
      </div>

      {/* Back Button */}
      <div>
        <Button
          variant="outline"
          onClick={() => navigate('/tasks')}
          className="inline-flex items-center"
        >
          <FiArrowLeft className="h-4 w-4 mr-2" />
          Back to Tasks
        </Button>
      </div>

      {/* Update Form */}
      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter a clear and descriptive task title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
          </div>

          {/* Task Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Provide detailed information about what needs to be accomplished..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">Optional: Add context, requirements, or specific instructions</p>
          </div>

          {/* Priority and Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white"
              >
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🔴 High Priority</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Current Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white"
              >
                <option value="pending">⏱️ Pending</option>
                <option value="inProgress">🚀 In Progress</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>
          </div>

          {/* Employee Assignment */}
          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-2">
              Assign to Team Member <span className="text-red-500">*</span>
            </label>
            <select
              id="employeeId"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white"
            >
              <option value="">👥 Select a team member...</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  👤 {employee.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Choose the team member responsible for this task</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              loading={saving}
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center transition-colors duration-200"
            >
              {saving ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Updating Task...
                </>
              ) : (
                <>
                  <FiSave className="h-4 w-4 mr-2" />
                  Update Task
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
              className="flex-1 sm:flex-initial px-6 py-3 flex items-center justify-center"
            >
              <FiX className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </Card>

      {/* Help Section */}
      <Card className="p-6 bg-blue-50 border border-blue-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <FiEdit3 className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-900">Update Guidelines</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-4 space-y-1">
                <li>Ensure the task title clearly describes what needs to be done</li>
                <li>Update status to reflect current progress accurately</li>
                <li>Reassign if the current assignee is unavailable</li>
                <li>Adjust priority based on business requirements</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
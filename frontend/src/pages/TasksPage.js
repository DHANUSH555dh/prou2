import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit2, FiFilter, FiPlus } from 'react-icons/fi';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Badge, Skeleton } from '../components/UI';
import toast from 'react-hot-toast';

function TaskCard({ task, onEdit, isAdmin }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in-progress': return 'blue';
      default: return 'yellow';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'in-progress': return 'In Progress';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
        {isAdmin && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(task._id)}
            className="ml-2"
          >
            <FiEdit2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <p className="text-gray-600 mb-4">{task.description || 'No description'}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Badge variant={getStatusColor(task.status)}>
            {getStatusText(task.status)}
          </Badge>
          <span className="text-sm text-gray-500">
            Assigned to: <span className="font-medium">{task.employeeId?.name || 'Unknown'}</span>
          </span>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(task.createdAt).toLocaleDateString()}
        </span>
      </div>
    </Card>
  );
}

function TaskFilters({ employees, filters, onFilter, isAdmin }) {
  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center mb-3">
        <FiFilter className="h-4 w-4 mr-2 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filter Tasks</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isAdmin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee
            </label>
            <select
              className="select-field"
              value={filters.employeeId || ''}
              onChange={(e) => onFilter('employeeId', e.target.value)}
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            className="select-field"
            value={filters.status || ''}
            onChange={(e) => onFilter('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      
      {(filters.employeeId || filters.status) && (
        <button
          onClick={() => onFilter('reset')}
          className="mt-3 text-sm text-primary-600 hover:text-primary-700"
        >
          Clear all filters
        </button>
      )}
    </Card>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const requests = [api.get('/tasks', { params: filters })];
        
        if (isAdmin) {
          requests.push(api.get('/employees'));
        }

        const responses = await Promise.all(requests);
        
        setTasks(responses[0].data);
        if (isAdmin && responses[1]) {
          setEmployees(responses[1].data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, isAdmin]);

  const handleFilter = (key, value) => {
    if (key === 'reset') {
      setFilters({});
    } else {
      setFilters((prev) => ({ ...prev, [key]: value || undefined }));
    }
  };

  const handleEdit = (taskId) => {
    navigate(`/tasks/${taskId}/edit`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAdmin ? 'All Tasks' : 'My Tasks'}
          </h1>
          <p className="text-gray-600">
            {isAdmin 
              ? 'Manage and monitor all team tasks' 
              : 'View and track your assigned tasks'
            }
          </p>
        </div>
        
        {isAdmin && (
          <Link to="/tasks/new">
            <Button className="inline-flex items-center">
              <FiPlus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </Link>
        )}
      </div>

      <TaskFilters 
        employees={employees} 
        filters={filters}
        onFilter={handleFilter}
        isAdmin={isAdmin}
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </Card>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-gray-400">
            <FiFilter className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks Found</h3>
            <p className="text-gray-600">
              {Object.keys(filters).length > 0 
                ? 'Try adjusting your filters to see more tasks.' 
                : 'No tasks have been created yet.'
              }
            </p>
            {isAdmin && Object.keys(filters).length === 0 && (
              <Link to="/tasks/new" className="mt-4 inline-block">
                <Button>Create Your First Task</Button>
              </Link>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onEdit={handleEdit} 
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
}
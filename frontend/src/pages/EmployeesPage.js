import React, { useEffect, useState } from 'react';
import { FiUsers, FiCheckSquare, FiUserPlus } from 'react-icons/fi';
import api from '../api/api';
import { Card, LoadingSpinner, Skeleton } from '../components/UI';
import toast from 'react-hot-toast';

function EmployeeCard({ emp }) {
  const getTaskCountColor = (count) => {
    if (count === 0) return 'text-gray-500';
    if (count <= 2) return 'text-green-600';
    if (count <= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary-500">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <FiUsers className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">{emp.name}</h3>
            <div className="flex items-center mt-1">
              <FiCheckSquare className="h-4 w-4 text-gray-400 mr-1" />
              <span className={`text-sm font-medium ${getTaskCountColor(emp.taskCount ?? 0)}`}>
                {emp.taskCount ?? 0} {(emp.taskCount ?? 0) === 1 ? 'task' : 'tasks'} assigned
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getTaskCountColor(emp.taskCount ?? 0)}`}>
            {emp.taskCount ?? 0}
          </div>
        </div>
      </div>
      
      {/* Progress bar based on task load */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Workload</span>
          <span>
            {emp.taskCount === 0 ? 'Available' : 
             emp.taskCount <= 2 ? 'Light' :
             emp.taskCount <= 5 ? 'Moderate' : 'Heavy'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              emp.taskCount === 0 ? 'bg-gray-300 w-0' :
              emp.taskCount <= 2 ? 'bg-green-500' :
              emp.taskCount <= 5 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min((emp.taskCount / 8) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get('/employees');
        setEmployees(response.data);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
        toast.error('Failed to load employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="ml-4 flex-1">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <FiUsers className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Members</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Manage your team and monitor task assignments. Keep track of workload distribution 
          to ensure optimal productivity across all team members.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            {employees.length}
          </div>
          <div className="text-sm text-gray-600">Total Employees</div>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {employees.reduce((sum, emp) => sum + (emp.taskCount || 0), 0)}
          </div>
          <div className="text-sm text-gray-600">Total Tasks Assigned</div>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {employees.length > 0 ? Math.round(employees.reduce((sum, emp) => sum + (emp.taskCount || 0), 0) / employees.length * 10) / 10 : 0}
          </div>
          <div className="text-sm text-gray-600">Avg Tasks per Employee</div>
        </Card>
      </div>

      {/* Employees Grid */}
      {employees.length === 0 ? (
        <Card className="p-12 text-center">
          <FiUserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Employees Found</h3>
          <p className="text-gray-600 mb-4">
            Get started by adding team members to your organization.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee) => (
            <EmployeeCard key={employee._id} emp={employee} />
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="text-center pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Employee workload is calculated based on currently assigned tasks. 
          <span className="text-primary-600 font-medium ml-1">
            Manage task assignments to optimize team productivity.
          </span>
        </p>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { FiCheckSquare, FiClock, FiPlay, FiUsers } from 'react-icons/fi';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Card, LoadingSpinner, Skeleton } from '../components/UI';
import { TaskStatusChart, TasksPerEmployeeChart, RecentActivityChart } from '../components/Charts';

function StatCard({ title, value, icon: Icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
  };

  return (
    <Card className="flex items-center p-6">
      <div className={`p-3 rounded-full ${colorClasses[color]} text-white mr-4`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard');
        setDashboard(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Failed to Load Dashboard</h3>
          <p className="text-sm text-gray-500">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
        </h1>
        <p className="text-gray-600">
          {isAdmin 
            ? 'Overview of all tasks and team performance' 
            : 'Overview of your assigned tasks'
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tasks"
          value={dashboard.totalTasks}
          icon={FiCheckSquare}
          color="blue"
        />
        <StatCard
          title="Completed"
          value={dashboard.completed}
          icon={FiCheckSquare}
          color="green"
        />
        <StatCard
          title="In Progress"
          value={dashboard.inProgress}
          icon={FiPlay}
          color="yellow"
        />
        <StatCard
          title="Pending"
          value={dashboard.pending}
          icon={FiClock}
          color="purple"
        />
      </div>

      {/* Completion Rate */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Completion Rate</h3>
        <div className="flex items-center">
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${dashboard.completionRate}%` }}
              ></div>
            </div>
          </div>
          <span className="ml-4 text-2xl font-bold text-gray-900">
            {dashboard.completionRate}%
          </span>
        </div>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Task Status Distribution</h3>
          <TaskStatusChart data={dashboard} />
        </Card>

        {/* Admin-only Charts */}
        {isAdmin && dashboard.tasksPerEmployee && (
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tasks per Employee</h3>
            <TasksPerEmployeeChart data={dashboard.tasksPerEmployee} />
          </Card>
        )}

        {isAdmin && dashboard.totalEmployees && (
          <Card className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <FiUsers className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-3xl font-bold text-gray-900">{dashboard.totalEmployees}</p>
                <p className="text-gray-600">Total Employees</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Recent Activity Chart - Admin only */}
      {isAdmin && dashboard.recentActivity && dashboard.recentActivity.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity (Last 7 Days)</h3>
          <RecentActivityChart data={dashboard.recentActivity} />
        </Card>
      )}
    </div>
  );
}
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export function TaskStatusChart({ data }) {
  const chartData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [data.pending, data.inProgress, data.completed],
        backgroundColor: [
          '#f59e0b', // amber for pending
          '#3b82f6', // blue for in-progress
          '#10b981', // green for completed
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="h-64">
      <Pie data={chartData} options={options} />
    </div>
  );
}

export function TasksPerEmployeeChart({ data }) {
  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map(item => item.employeeName),
    datasets: [
      {
        label: 'Total Tasks',
        data: data.map(item => item.taskCount),
        backgroundColor: '#3b82f6',
      },
      {
        label: 'Completed Tasks',
        data: data.map(item => item.completed),
        backgroundColor: '#10b981',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
}

export function RecentActivityChart({ data }) {
  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map(item => {
      const date = new Date(item._id);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Tasks Created',
        data: data.map(item => item.tasksCreated),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Tasks Completed',
        data: data.map(item => item.tasksCompleted),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
}
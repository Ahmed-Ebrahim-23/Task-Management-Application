import React from 'react';
import { useTasks } from '../../context/TaskContext';
import '../../styles/dashboard.css';

const TaskStats = () => {
  const { statistics, filterTasks, currentFilter } = useTasks();

  const stats = statistics;
  const totalPercentage = stats.total > 0 ? (stats.done / stats.total) * 100 : 0;

  const statItems = [
    {
      key: 'all',
      label: 'All Tasks',
      count: stats.total,
      color: '#6b7280',
      isActive: currentFilter === 'all'
    },
    {
      key: 'pending',
      label: 'Pending',
      count: stats.pending,
      color: '#f59e0b',
      isActive: currentFilter === 'pending'
    },
    {
      key: 'in_progress',
      label: 'In Progress',
      count: stats.inProgress,
      color: '#3b82f6',
      isActive: currentFilter === 'in_progress'
    },
    {
      key: 'done',
      label: 'Done',
      count: stats.done,
      color: '#10b981',
      isActive: currentFilter === 'done'
    }
  ];

  const handleStatClick = (filter) => {
    filterTasks(filter);
  };

  return (
    <div className="task-stats">
      <h3 className="stats-title">Task Statistics</h3>
      
      <div className="stats-progress">
        <div className="progress-header">
          <span className="progress-label">Completion Rate</span>
          <span className="progress-percentage">{Math.round(totalPercentage)}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${totalPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="stats-grid">
        {statItems.map((item) => (
          <div 
            key={item.key}
            className={`stat-item ${item.isActive ? 'active' : ''}`}
            onClick={() => handleStatClick(item.key)}
            style={{ borderLeftColor: item.color }}
          >
            <div className="stat-content">
              <div className="stat-label">{item.label}</div>
              <div className="stat-count" style={{ color: item.color }}>
                {item.count}
              </div>
            </div>
          </div>
        ))}
      </div>

      {stats.total === 0 && (
        <div className="empty-stats">
          <p className="empty-stats-text">No tasks yet</p>
          <p className="empty-stats-subtext">Create your first task to see statistics</p>
        </div>
      )}
    </div>
  );
};

export default TaskStats;
import React, { useEffect, useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import TaskStats from './TaskStats';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import '../../styles/dashboard.css';

const Dashboard = () => {
  const { 
    loadTasks, 
    isLoading, 
    error, 
    filteredTasks, 
    currentFilter, 
    searchTerm,
    pagination,
    filterTasks,
    searchTasks,
    clearSearch,
    changePage,
    changePageSize
  } = useTasks();

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Load tasks when component mounts
  useEffect(() => {
    loadTasks(1, 10, '', 'all');
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        searchTasks(localSearchTerm);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localSearchTerm]);

  const handleSearchChange = (e) => {
    setLocalSearchTerm(e.target.value);
  };

  const handleSearchClear = () => {
    setLocalSearchTerm('');
    clearSearch();
  };

  const handleFilterChange = (filter) => {
    filterTasks(filter);
  };

  const toggleTaskForm = () => {
    setShowTaskForm(!showTaskForm);
  };

  if (isLoading && !filteredTasks.length) {
    return (
      <div className="dashboard-loading">
        <LoadingSpinner message="Loading your tasks..." />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Tasks</h1>
        <button 
          className="add-task-btn"
          onClick={toggleTaskForm}
        >
          + Add New Task
        </button>
      </div>

      {error && (
        <ErrorMessage 
          message={error} 
          onClose={() => window.location.reload()} 
        />
      )}

      {showTaskForm && (
        <div className="task-form-container">
          <TaskForm onClose={() => setShowTaskForm(false)} />
        </div>
      )}

      <div className="dashboard-content">
        <div className="dashboard-sidebar">
          <TaskStats />
        </div>

        <div className="dashboard-main">
          <div className="task-controls">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search tasks..."
                value={localSearchTerm}
                onChange={handleSearchChange}
              />
              {localSearchTerm && (
                <button 
                  className="search-clear"
                  onClick={handleSearchClear}
                >
                  ×
                </button>
              )}
            </div>

            <div className="filter-buttons">
              {['all', 'pending', 'in_progress', 'done'].map((filter) => (
                <button
                  key={filter}
                  className={`filter-btn ${currentFilter === filter ? 'active' : ''}`}
                  onClick={() => handleFilterChange(filter)}
                >
                  {filter === 'all' ? 'All' : 
                   filter === 'pending' ? 'Pending' :
                   filter === 'in_progress' ? 'In Progress' : 'Done'}
                </button>
              ))}
            </div>
          </div>

          <TaskList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
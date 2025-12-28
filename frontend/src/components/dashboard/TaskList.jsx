import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import TaskItem from './TaskItem';
import LoadingSpinner from '../common/LoadingSpinner';
import Pagination from './Pagination';
import '../../styles/dashboard.css';

const TaskList = () => {
  const { 
    filteredTasks, 
    isLoading, 
    currentFilter, 
    searchTerm,
    pagination,
    changePage,
    changePageSize
  } = useTasks();
  const [editingTaskId, setEditingTaskId] = useState(null);



  // Show loading spinner when loading tasks
  if (isLoading && filteredTasks.length === 0) {
    return (
      <div className="task-list-loading">
        <LoadingSpinner message="Loading tasks..." />
      </div>
    );
  }

  // Get filter description
  const getFilterDescription = () => {
    if (searchTerm) {
      return `Search results for "${searchTerm}"`;
    }
    
    switch (currentFilter) {
      case 'pending':
        return 'Pending Tasks';
      case 'in_progress':
        return 'In Progress Tasks';
      case 'done':
        return 'Completed Tasks';
      default:
        return 'All Tasks';
    }
  };

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h3 className="task-list-title">{getFilterDescription()}</h3>
        <span className="task-count">
          {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-tasks">
          <div className="empty-tasks-content">
            <div className="empty-tasks-icon">📝</div>
            <h4 className="empty-tasks-title">
              {searchTerm ? 'No matching tasks found' : 'No tasks yet'}
            </h4>
            <p className="empty-tasks-text">
              {searchTerm 
                ? 'Try adjusting your search terms or filters'
                : 'Create your first task to get started with your productivity journey!'
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="task-list">
          {filteredTasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onEdit={() => setEditingTaskId(task.id)}
              onCancelEdit={() => setEditingTaskId(null)}
              isEditing={editingTaskId === task.id}
            />
          ))}
        </div>
      )}
      
      {/* Pagination */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalCount={pagination.totalCount}
        pageSize={pagination.pageSize}
        onPageChange={changePage}
        onPageSizeChange={changePageSize}
        isLoading={isLoading}
      />
    </div>
  );
};

export default TaskList;
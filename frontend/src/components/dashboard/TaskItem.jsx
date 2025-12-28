import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import TaskForm from './TaskForm';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import '../../styles/dashboard.css';

const TaskItem = ({ task, onEdit, onCancelEdit, isEditing }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  
  const { updateTask, deleteTask, getStatusColor, getStatusText } = useTasks();

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    try {
      setError(null);
      const result = await updateTask(task.id, { status: newStatus });
      
      if (!result.success) {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteTask(task.id);
      
      if (result.success) {
        setShowDeleteConfirm(false);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status class
  const getStatusClass = (status) => {
    return `task-status-${status.replace('_', '-')}`;
  };

  if (isEditing) {
    return (
      <div className="task-item task-item-editing">
        <TaskForm 
          editingTask={task} 
          onClose={onCancelEdit} 
        />
      </div>
    );
  }

  return (
    <div className="task-item">
      {error && (
        <ErrorMessage 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}

      <div className="task-item-header">
        <div className="task-title-section">
          <h4 className="task-title">{task.title}</h4>
          <div className="task-meta">
            <span className={`task-status ${getStatusClass(task.status)}`}
                  style={{ color: getStatusColor(task.status) }}>
              {getStatusText(task.status)}
            </span>
            <span className="task-date">
              {formatDate(task.createdAt)}
            </span>
          </div>
        </div>

        <div className="task-actions">
          <button 
            className="task-action-btn edit-btn"
            onClick={onEdit}
            title="Edit task"
          >
            ✏️
          </button>
          <button 
            className="task-action-btn delete-btn"
            onClick={() => setShowDeleteConfirm(true)}
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>

      {task.description && (
        <div className="task-description">
          {task.description}
        </div>
      )}

      <div className="task-status-controls">
        <label className="status-label">Update Status:</label>
        <div className="status-buttons">
          {[
            { value: 'pending', label: 'Pending' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'done', label: 'Done' }
          ].map((statusOption) => (
            <button
              key={statusOption.value}
              className={`status-btn ${task.status === statusOption.value ? 'active' : ''}`}
              onClick={() => handleStatusChange(statusOption.value)}
              style={{
                backgroundColor: task.status === statusOption.value 
                  ? getStatusColor(statusOption.value) 
                  : 'transparent',
                color: task.status === statusOption.value 
                  ? 'white' 
                  : getStatusColor(statusOption.value)
              }}
            >
              {statusOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-modal">
            <h4 className="delete-confirm-title">Delete Task</h4>
            <p className="delete-confirm-message">
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </p>
            <div className="delete-confirm-actions">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                loading={isDeleting}
                disabled={isDeleting}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
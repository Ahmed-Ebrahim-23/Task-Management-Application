import React, { useState, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import Input from '../common/Input';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import '../../styles/dashboard.css';

const TaskForm = ({ onClose, editingTask = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending'
  });
  const [errors, setErrors] = useState({});
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createTask, updateTask, isLoading } = useTasks();

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        status: editingTask.status || 'pending'
      });
    }
  }, [editingTask]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowError(false);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let result;
      
      if (editingTask) {
        // Update existing task
        result = await updateTask(editingTask.id, formData);
      } else {
        // Create new task
        result = await createTask(formData);
      }

      if (result.success) {
        // Reset form and close
        setFormData({
          title: '',
          description: '',
          status: 'pending'
        });
        onClose();
      } else {
        setShowError(true);
        setErrors({ submit: result.error });
      }
    } catch (error) {
      setShowError(true);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      status: 'pending'
    });
    onClose();
  };

  const isEditing = !!editingTask;

  return (
    <div className="task-form-overlay">
      <div className="task-form-container">
        <div className="task-form-header">
          <h3 className="task-form-title">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button 
            className="task-form-close"
            onClick={handleCancel}
          >
            ×
          </button>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          {showError && errors.submit && (
            <ErrorMessage 
              message={errors.submit} 
              onClose={() => setShowError(false)} 
            />
          )}

          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Task Title *
            </label>
            <Input
              type="text"
              name="title"
              id="title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={handleInputChange}
              required
              error={!!errors.title}
              errorMessage={errors.title}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              className="form-textarea"
              placeholder="Enter task description (optional)"
              value={formData.description}
              onChange={handleInputChange}
              disabled={isSubmitting}
              rows={4}
            />
            {errors.description && (
              <div className="input-error-message">{errors.description}</div>
            )}
          </div>

          {isEditing && (
            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                name="status"
                id="status"
                className="form-select"
                value={formData.status}
                onChange={handleInputChange}
                disabled={isSubmitting}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          )}

          <div className="task-form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isEditing ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
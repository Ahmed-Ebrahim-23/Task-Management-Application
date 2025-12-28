import { apiClient } from './api';

export const taskService = {
  // Get all tasks for the current user with pagination
  async getAllTasks(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `/tasks?${queryString}` : '/tasks';
      return await apiClient.get(url);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get task statistics from all tasks
  async getTaskStatistics() {
    try {
      return await apiClient.get('/tasks/statistics');
    } catch (error) {
      throw new Error(error.message);
    }
  },



  // Create a new task
  async createTask(taskData) {
    try {
      const response = await apiClient.post('/tasks', taskData);
      
      if (response.status === 'success') {
        return {
          success: true,
          data: response.data,
          message: response.message
        };
      }
      
      return {
        success: false,
        error: response.message || 'Failed to create task'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Update an existing task
  async updateTask(taskId, updates) {
    try {
      const response = await apiClient.put(`/tasks/${taskId}`, updates);
      
      if (response.status === 'success') {
        return {
          success: true,
          data: response.data,
          message: response.message
        };
      }
      
      return {
        success: false,
        error: response.message || 'Failed to update task'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Delete a task
  async deleteTask(taskId) {
    try {
      const response = await apiClient.delete(`/tasks/${taskId}`);
      
      if (response.status === 'success') {
        return {
          success: true,
          message: response.message
        };
      }
      
      return {
        success: false,
        error: response.message || 'Failed to delete task'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get a specific task by ID
  async getTaskById(taskId) {
    try {
      return await apiClient.get(`/tasks/${taskId}`);
    } catch (error) {
      throw new Error(error.message);
    }
  },



  // Get task statistics
  getTaskStats(tasks) {
    return {
      total: tasks.length,
      pending: tasks.filter(task => task.status === 'pending').length,
      inProgress: tasks.filter(task => task.status === 'in_progress').length,
      done: tasks.filter(task => task.status === 'done').length
    };
  },

  // Get status color for UI
  getStatusColor(status) {
    const colors = {
      'pending': '#f59e0b',
      'in_progress': '#3b82f6', 
      'done': '#10b981' 
    };
    return colors[status] || '#6b7280';
  },

  // Helper method to filter tasks by status
  filterTasksByStatus(tasks, status) {
    if (status === 'all') return tasks;
    return tasks.filter(task => task.status === status);
  },

  // Helper method to search tasks by title only
  searchTasksByTitle(tasks, searchTerm) {
    if (!searchTerm) return tasks;
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },

  // Get task statistics
  getTaskStats(tasks) {
    return {
      total: tasks.length,
      pending: tasks.filter(task => task.status === 'pending').length,
      inProgress: tasks.filter(task => task.status === 'in_progress').length,
      done: tasks.filter(task => task.status === 'done').length
    };
  },

  // Get status color for UI
  getStatusColor(status) {
    const colors = {
      'pending': '#f59e0b', 
      'in_progress': '#3b82f6',
      'done': '#10b981' 
    };
    return colors[status] || '#6b7280';
  },

  // Get status display text
  getStatusText(status) {
    const statusTexts = {
      'pending': 'Pending',
      'in_progress': 'In Progress',
      'done': 'Done'
    };
    return statusTexts[status] || status;
  }
};
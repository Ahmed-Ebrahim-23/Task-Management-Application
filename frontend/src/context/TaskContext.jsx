import React, { createContext, useContext, useState, useEffect } from 'react';
import { taskService } from '../services/tasks';

const TaskContext = createContext({});

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10
  });
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    done: 0
  });

  // Update filtered tasks
  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  // Load statistics from all tasks 
  const loadStatistics = async () => {
    try {
      const response = await taskService.getTaskStatistics();
      
      if (response.status === 'success' && response.data) {
        setStatistics(response.data);
      } else {
        console.error('Failed to load statistics:', response.message);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  // Load tasks from API with pagination
  const loadTasks = async (page = 1, pageSize = 10, search = '', status = 'all') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await taskService.getAllTasks({
        page,
        limit: pageSize,
        search,
        status
      });
      
      if (response.status === 'success' && response.data) {
        setTasks(response.data.tasks || []);
        setPagination(response.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          pageSize: 10
        });
        // Refresh statistics after loading tasks
        await loadStatistics();
      } else {
        throw new Error(response.message || 'Failed to load tasks');
      }
    } catch (error) {
      setError(error.message);
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new task
  const createTask = async (taskData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await taskService.createTask(taskData);
      
      if (result.success) {
        // Add the new task to the tasks array
        setTasks(prevTasks => [result.data, ...prevTasks]);
        // Refresh statistics
        await loadStatistics();
        return { success: true, message: result.message };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Update existing task
  const updateTask = async (taskId, updates) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await taskService.updateTask(taskId, updates);
      
      if (result.success) {
        // Update the task in the tasks array
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId ? result.data : task
          )
        );
        // Refresh statistics
        await loadStatistics();
        return { success: true, message: result.message };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await taskService.deleteTask(taskId);
      
      if (result.success) {
        // Remove the task from the tasks array
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        // Refresh statistics
        await loadStatistics();
        return { success: true, message: result.message };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Filter tasks by status
  const filterTasks = (status) => {
    setCurrentFilter(status);
    // Reload tasks with new filter
    loadTasks(1, pagination.pageSize, searchTerm, status);
  };

  // Search tasks
  const searchTasks = (term) => {
    setSearchTerm(term);
    // Reload tasks with new search
    loadTasks(1, pagination.pageSize, term, currentFilter);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    // Reload tasks without search
    loadTasks(1, pagination.pageSize, '', currentFilter);
  };

  // Change page
  const changePage = (page) => {
    loadTasks(page, pagination.pageSize, searchTerm, currentFilter);
  };

  // Change page size
  const changePageSize = (pageSize) => {
    loadTasks(1, pageSize, searchTerm, currentFilter);
  };

  // Load statistics when component mounts
  useEffect(() => {
    loadStatistics();
  }, []);

  // Get task by ID
  const getTaskById = (taskId) => {
    return tasks.find(task => task.id === parseInt(taskId));
  };

  const value = {
    // State
    tasks,
    filteredTasks,
    currentFilter,
    searchTerm,
    isLoading,
    error,
    pagination,
    statistics,
    
    // Actions
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    filterTasks,
    searchTasks,
    clearSearch,
    changePage,
    changePageSize,
    loadStatistics,
    getTaskById,
    
    // Utils
    getStatusColor: taskService.getStatusColor,
    getStatusText: taskService.getStatusText
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
import { apiClient } from './api';

export const authService = {
  // Login user
  async login(credentials) {
    try {
      console.log('Attempting login with:', { email: credentials.email });
      const response = await apiClient.post('/auth/login', credentials);
      console.log('Login response:', response);
      
      if (response.status === 'success' && response.data.token) {
        // Store token and user data
        localStorage.setItem('authToken', response.data.token);
        
        // Fetch user profile after successful login
        const userProfile = await this.getCurrentUser();
        console.log('User profile:', userProfile);
        
        if (userProfile.status === 'success') {
          localStorage.setItem('user', JSON.stringify(userProfile.data));
          return {
            success: true,
            data: {
              token: response.data.token,
              user: userProfile.data
            }
          };
        }
      }
      
      return {
        success: false,
        error: response.message || 'Login failed'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Register user
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData);
      
      if (response.status === 'success') {
        return {
          success: true,
          data: response.data
        };
      }
      
      return {
        success: false,
        error: response.message || 'Registration failed'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get current user profile
  async getCurrentUser() {
    try {
      return await apiClient.get('/users/');
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    // Force page reload to clear all state
    window.location.reload();
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get stored user data
  getStoredUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },

  // Get stored token
  getStoredToken() {
    return localStorage.getItem('authToken');
  },

  // Refresh user data
  async refreshUser() {
    try {
      const response = await this.getCurrentUser();
      if (response.status === 'success') {
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
      }
    } catch (error) {
      this.logout();
      throw error;
    }
  }
};
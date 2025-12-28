import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showError, setShowError] = useState(false);
  
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setShowError(true);
      setErrors({ submit: result.error });
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

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Task Management</h1>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {showError && errors.submit && (
            <ErrorMessage 
              message={errors.submit} 
              onClose={() => setShowError(false)} 
            />
          )}

          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            required
            error={!!errors.email}
            errorMessage={errors.email}
            disabled={isLoading}
          />

          <Input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            required
            error={!!errors.password}
            errorMessage={errors.password}
            disabled={isLoading}
          />

          <Button
            type="submit"
            variant="primary"
            size="large"
            disabled={isLoading}
            loading={isLoading}
            className="auth-submit"
          >
            Sign In
          </Button>
        </form>

        <div className="auth-footer">
          <p className="auth-link-text">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
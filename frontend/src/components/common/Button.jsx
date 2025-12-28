import React from 'react';
import '../../styles/components.css';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props 
}) => {
  const buttonClass = `btn btn-${variant} btn-${size} ${className} ${disabled || loading ? 'btn-disabled' : ''}`;

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <div className="btn-content">
          <div className="btn-spinner"></div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
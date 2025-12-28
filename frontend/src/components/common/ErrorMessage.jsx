import React from 'react';
import '../../styles/components.css';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="error-message">
      <span className="error-text">{message}</span>
      {onClose && (
        <button 
          className="error-close"
          onClick={onClose}
          aria-label="Close error"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
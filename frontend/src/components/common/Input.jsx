import React from 'react';
import '../../styles/components.css';

const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onKeyPress,
  name,
  id,
  disabled = false,
  required = false,
  error = false,
  errorMessage = '',
  className = '',
  ...props
}) => {
  const inputClass = `input ${error ? 'input-error' : ''} ${className}`;

  return (
    <div className="input-group">
      <input
        type={type}
        className={inputClass}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        name={name}
        id={id}
        disabled={disabled}
        required={required}
        {...props}
      />
      {error && errorMessage && (
        <div className="input-error-message">{errorMessage}</div>
      )}
    </div>
  );
};

export default Input;
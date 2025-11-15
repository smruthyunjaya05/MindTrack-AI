import React from 'react';

/**
 * SecondaryButton Component
 * Subtle secondary action button
 * @param {string} children - Button text
 * @param {string} className - Additional Tailwind classes
 * @param {boolean} disabled - Disabled state
 */
const SecondaryButton = ({ children, className = '', disabled = false, ...props }) => {
  return (
    <button
      className={`btn-secondary ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;

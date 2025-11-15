import React from 'react';

/**
 * PrimaryButton Component
 * Orange gradient CTA button with glow effects
 * @param {string} children - Button text
 * @param {string} className - Additional Tailwind classes
 * @param {boolean} disabled - Disabled state
 */
const PrimaryButton = ({ children, className = '', disabled = false, ...props }) => {
  return (
    <button
      className={`btn-primary ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;

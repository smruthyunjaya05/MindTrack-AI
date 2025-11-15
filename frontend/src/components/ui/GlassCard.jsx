import React from 'react';

/**
 * GlassCard Component
 * Professional glassmorphic card with 3 variants
 * @param {string} variant - 'default' | 'elevated' | 'accent'
 * @param {string} className - Additional Tailwind classes
 * @param {React.ReactNode} children - Card content
 */
const GlassCard = ({ variant = 'default', className = '', children, ...props }) => {
  const variantClasses = {
    default: 'glass-card',
    elevated: 'glass-card-elevated',
    accent: 'glass-card-accent',
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default GlassCard;

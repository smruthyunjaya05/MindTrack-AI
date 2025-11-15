import React from 'react';

/**
 * ToggleSwitch Component
 * Two-option toggle for Text/URL input modes
 * @param {boolean} isLeft - True if left option selected
 * @param {function} onToggle - Callback when toggled
 * @param {string} leftLabel - Left option label
 * @param {string} rightLabel - Right option label
 */
const ToggleSwitch = ({
  isLeft = true,
  onToggle,
  leftLabel = 'Text Input',
  rightLabel = 'URL Input',
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center rounded-12 bg-bg-tertiary p-1 ${className}`}>
      <button
        onClick={() => onToggle(true)}
        className={`px-6 py-2 rounded-10 font-medium text-sm transition-all duration-300 ${
          isLeft
            ? 'bg-gradient-primary text-white shadow-glow-orange'
            : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        {leftLabel}
      </button>
      <button
        onClick={() => onToggle(false)}
        className={`px-6 py-2 rounded-10 font-medium text-sm transition-all duration-300 ${
          !isLeft
            ? 'bg-gradient-primary text-white shadow-glow-orange'
            : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        {rightLabel}
      </button>
    </div>
  );
};

export default ToggleSwitch;

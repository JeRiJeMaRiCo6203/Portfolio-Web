import React from 'react';

const CategorySelector = ({ value, onChange }) => {
  const options = [
    { key: 'personal', label: 'Personal' },
    { key: 'work', label: 'Work' },
  ];

  const activeIndex = options.findIndex((o) => o.key === value);

  const handleKeyDown = (e, index) => {
    let nextIndex;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % options.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + options.length) % options.length;
    }
    if (nextIndex !== undefined) {
      onChange(options[nextIndex].key);
      // Focus the newly active tab
      const container = e.currentTarget.closest('.category-selector');
      const tabs = container?.querySelectorAll('[role="tab"]');
      tabs?.[nextIndex]?.focus();
    }
  };

  return (
    <div className="category-selector" role="tablist" aria-label="Project category">
      {/* Sliding active indicator */}
      <div
        className="category-indicator"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {options.map((option, i) => (
        <button
          key={option.key}
          role="tab"
          aria-selected={value === option.key}
          tabIndex={value === option.key ? 0 : -1}
          className={`category-tab ${value === option.key ? 'active' : ''}`}
          onClick={() => onChange(option.key)}
          onKeyDown={(e) => handleKeyDown(e, i)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;

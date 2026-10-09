import React from 'react';

/**
 * Reusable botanical Button component.
 * 
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'accent' | 'outline'} [props.variant='primary'] Visual appearance
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] Size scale
 * @param {boolean} [props.isLoading=false] Indicates async action in progress
 * @param {boolean} [props.disabled=false] Disabled interaction state
 * @param {React.ReactNode} props.children Button contents
 * @param {string} [props.className=''] Extra classes
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  children,
  className = '',
  type = 'button',
  ...props
}) {
  const variantClass = `btn--${variant}`;
  const sizeClass = size !== 'md' ? `btn--${size}` : '';
  const combinedClasses = `btn ${variantClass} ${sizeClass} ${className}`.trim();

  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        <span
          className={`spinner ${variant === 'primary' || variant === 'accent' ? 'spinner--light' : ''}`}
          style={{ width: '16px', height: '16px', borderWidth: '2px' }}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </button>
  );
}

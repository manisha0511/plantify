import React from 'react';

/**
 * Reusable Badge / Tag component for categories, plant status, and highlights.
 * 
 * @param {Object} props
 * @param {'default' | 'forest' | 'sage' | 'amber' | 'outline'} [props.variant='default']
 * @param {React.ReactNode} [props.icon] Optional icon/glyph rendered before label
 * @param {React.ReactNode} props.children Text/content of badge
 * @param {string} [props.className='']
 */
export default function Badge({
  variant = 'default',
  icon,
  children,
  className = '',
  ...props
}) {
  const variantClass = `badge--${variant}`;
  const combinedClasses = `badge ${variantClass} ${className}`.trim();

  return (
    <span className={combinedClasses} {...props}>
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

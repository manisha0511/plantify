import React from 'react';

/**
 * Reusable Plantify Brand Logo Component.
 * Combines a custom botanical leaf emblem with the brand wordmark and tagline.
 * 
 * @param {Object} props
 * @param {boolean} [props.showTagline=true] Whether to display "Greener Tomorrow"
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] Logo scaling size
 * @param {string} [props.className='']
 */
export default function Logo({
  showTagline = true,
  size = 'md',
  className = '',
  ...props
}) {
  const sizeMap = {
    sm: { icon: 28, text: '1.25rem', tagline: '0.65rem' },
    md: { icon: 36, text: '1.5rem', tagline: '0.72rem' },
    lg: { icon: 46, text: '1.9rem', tagline: '0.85rem' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`brand-logo ${className}`.trim()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
        userSelect: 'none',
      }}
      {...props}
    >
      {/* Custom Botanical Leaf Emblem */}
      <svg
        width={currentSize.icon}
        height={currentSize.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
        aria-hidden="true"
      >
        {/* Soft Sage Background Leaf */}
        <path
          d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 32 4 24 4C24 16 16 26 24 44Z"
          fill="var(--color-sage-soft)"
          opacity="0.85"
        />
        {/* Forest Green Primary Sprout */}
        <path
          d="M24 44C12.9543 44 4 35.0457 4 24C4 11 18 4 24 4C24 17 32 29 24 44Z"
          fill="var(--color-forest)"
        />
        {/* Central Vein Line */}
        <path
          d="M24 44V10M24 24L32 17M24 32L16 25"
          stroke="var(--color-off-white)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Small Amber Sunlight Sparkle */}
        <circle cx="36" cy="10" r="3" fill="var(--color-amber)" />
      </svg>

      {/* Typography Wordmark */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <div style={{
          fontFamily: "var(--font-serif)",
          fontSize: currentSize.text,
          fontWeight: 700,
          color: 'var(--color-forest)',
          letterSpacing: '-0.02em',
        }}>
          Plant<span style={{ color: 'var(--color-sage-soft)', fontWeight: 600 }}>ify</span>
        </div>
        {showTagline && (
          <div style={{
            fontFamily: "var(--font-sans)",
            fontSize: currentSize.tagline,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-charcoal-light)',
            fontWeight: 600,
            marginTop: '2px',
          }}>
            Greener Tomorrow
          </div>
        )}
      </div>
    </div>
  );
}

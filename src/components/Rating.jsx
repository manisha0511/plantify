import React from 'react';

/**
 * Accessible Star Rating component.
 * Renders stars alongside semantic text so rating is never communicated via color alone.
 * 
 * @param {Object} props
 * @param {number} props.value Numeric rating (e.g. 4.8)
 * @param {number} [props.max=5] Maximum possible rating
 * @param {number} [props.reviewCount] Optional total review count
 * @param {boolean} [props.showText=true] Whether to show numeric score
 * @param {string} [props.className='']
 */
export default function Rating({
  value = 5,
  max = 5,
  reviewCount,
  showText = true,
  className = '',
  ...props
}) {
  // Clamp value between 0 and max
  const clampedValue = Math.max(0, Math.min(value, max));
  const accessibleLabel = `Rated ${clampedValue} out of ${max} stars${reviewCount ? ` across ${reviewCount} customer reviews` : ''}`;

  return (
    <div
      className={`rating-container ${className}`.trim()}
      role="img"
      aria-label={accessibleLabel}
      {...props}
    >
      <div className="rating-stars" aria-hidden="true">
        {Array.from({ length: max }, (_, index) => {
          const starNumber = index + 1;
          const isFilled = clampedValue >= starNumber;
          const isHalf = !isFilled && clampedValue >= starNumber - 0.5;

          return (
            <svg
              key={index}
              className="rating-star"
              viewBox="0 0 24 24"
              fill={isFilled ? 'var(--color-amber)' : 'none'}
              stroke="var(--color-amber)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isHalf ? (
                // Half-filled star using SVG linearGradient
                <>
                  <defs>
                    <linearGradient id={`half-star-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="50%" stopColor="var(--color-amber)" />
                      <stop offset="50%" stopColor="transparent" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                    fill={`url(#half-star-${index})`}
                  />
                </>
              ) : (
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              )}
            </svg>
          );
        })}
      </div>

      {showText && (
        <span className="rating-text">
          {clampedValue.toFixed(1)}
          <span style={{ fontWeight: 400, color: 'var(--color-charcoal-light)', fontSize: '0.85em', marginLeft: '2px' }}>
            /{max}
          </span>
        </span>
      )}

      {reviewCount !== undefined && (
        <span className="rating-reviews">({reviewCount})</span>
      )}
    </div>
  );
}

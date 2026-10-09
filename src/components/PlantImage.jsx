import React, { useState } from 'react';

export const BOTANICAL_PLACEHOLDER = '/botanical-placeholder.svg';

/**
 * PlantImage Component.
 * 
 * Reusable, resilient image component for Plantify:
 * 1. Handles missing, empty, or broken URLs by displaying the local botanical placeholder.
 * 2. Prevents infinite error loops using a fallbackTried flag.
 * 3. Enforces stable layout and aspect ratio to prevent Cumulative Layout Shift (CLS).
 * 4. Provides meaningful botanical alt text.
 * 5. Uses native lazy loading (`loading="lazy"`).
 */
export default function PlantImage({
  src,
  alt = 'Botanical Specimen',
  className = '',
  style = {},
  aspectRatio = '1 / 1',
  objectFit = 'cover',
  loading = 'lazy',
  onError,
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(src || BOTANICAL_PLACEHOLDER);
  const [hasFailed, setHasFailed] = useState(!src);

  // If incoming src prop changes, update internal state
  React.useEffect(() => {
    if (src && src.trim() !== '') {
      setImgSrc(src);
      setHasFailed(false);
    } else {
      setImgSrc(BOTANICAL_PLACEHOLDER);
      setHasFailed(true);
    }
  }, [src]);

  const handleError = (e) => {
    if (!hasFailed) {
      setHasFailed(true);
      setImgSrc(BOTANICAL_PLACEHOLDER);
      if (onError) onError(e);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt || 'Botanical Specimen'}
      className={className}
      loading={loading}
      onError={handleError}
      style={{
        width: '100%',
        height: '100%',
        objectFit,
        aspectRatio: aspectRatio || undefined,
        display: 'block',
        backgroundColor: '#F0F3EC',
        ...style,
      }}
      {...props}
    />
  );
}

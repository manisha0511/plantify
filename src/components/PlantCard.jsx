import React, { useState } from 'react';
import Badge from './Badge.jsx';
import Rating from './Rating.jsx';
import Button from './Button.jsx';
import PlantImage from './PlantImage.jsx';

/**
 * Reusable PlantCard Component for E-Commerce Catalog & Grids.
 * 
 * @param {Object} props
 * @param {Object} props.plant Botanical product data
 * @param {boolean} [props.isWishlisted=false] Controlled wishlist status
 * @param {Function} [props.onAddToCart] Handler for cart action
 * @param {Function} [props.onToggleWishlist] Handler for wishlist toggle
 * @param {Function} [props.onQuickView] Handler for modal quick-view
 * @param {Function} [props.onSelectPlant] Handler for opening dedicated plant details view
 */
export default function PlantCard({
  plant,
  isWishlisted = false,
  onAddToCart,
  onToggleWishlist,
  onQuickView,
  onSelectPlant,
}) {
  const [isAdding, setIsAdding] = useState(false);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(plant);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      if (onAddToCart) onAddToCart(plant);
    }, 350);
  };

  const handleCardClick = () => {
    if (onSelectPlant) {
      onSelectPlant(plant);
    } else if (onQuickView) {
      onQuickView(plant);
    }
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(plant);
  };

  return (
    <article
      className="plant-card"
      aria-labelledby={`plant-title-${plant.id}`}
      style={{ cursor: 'pointer' }}
      onClick={handleCardClick}
    >
      
      {/* Media Container with 1:1 Aspect Ratio */}
      <div className="plant-card-media">
        <PlantImage
          src={plant.image}
          alt={plant.name}
          className="plant-card-img"
        />

        {/* Status / Category Badge */}
        {plant.badge && (
          <div className="plant-card-badge-container">
            <Badge variant={plant.badge.variant || 'forest'}>
              {plant.badge.text}
            </Badge>
          </div>
        )}

        {/* Favorite / Wishlist Button */}
        <button
          type="button"
          className="plant-card-fav-btn"
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? `Remove ${plant.name} from wishlist` : `Add ${plant.name} to wishlist`}
          style={{
            color: isWishlisted ? 'var(--color-amber)' : 'var(--color-charcoal-muted)',
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={isWishlisted ? 'var(--color-amber)' : 'none'}
            stroke={isWishlisted ? 'var(--color-amber)' : 'currentColor'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Card Body & Details */}
      <div className="plant-card-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="plant-card-category">{plant.category}</div>
          {plant.source && (
            <span style={{ fontSize: '10px', color: 'var(--color-charcoal-light)', fontWeight: 500 }}>
              {plant.source.includes('Live') ? '🌐 Live API' : '🌱 Verified'}
            </span>
          )}
        </div>
        
        <h3 id={`plant-title-${plant.id}`} className="plant-card-title">
          {plant.name}
        </h3>
        
        <div className="plant-card-scientific">
          {plant.scientificName}
        </div>

        {/* Quick Botanical Care Requirements */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-charcoal-muted)',
          margin: 'var(--space-xs) 0',
        }}>
          {plant.environment && (
            <span style={{ backgroundColor: 'var(--color-sage-pale)', padding: '2px 6px', borderRadius: '4px', color: 'var(--color-forest)', fontWeight: 600 }}>
              🏡 {plant.environment}
            </span>
          )}
          <span title={`Light requirement: ${plant.light}`}>☀️ {plant.light}</span>
          <span>•</span>
          <span title={`Watering schedule: ${plant.water}`}>💧 {plant.water}</span>
        </div>

        {/* Star Rating */}
        <div style={{ margin: 'var(--space-xs) 0' }}>
          <Rating value={plant.rating} reviewCount={plant.reviewCount} />
        </div>

        {/* Price Row & Action Buttons */}
        <div className="plant-card-price-row">
          <div>
            <span className="plant-card-price">${plant.price.toFixed(2)}</span>
            {plant.originalPrice && (
              <span className="plant-card-original-price" style={{ marginLeft: '6px' }}>
                ${plant.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleQuickViewClick}
              aria-label={`Quick view details for ${plant.name}`}
              style={{ padding: '0.4rem 0.65rem' }}
              title="Quick View"
            >
              👁️
            </Button>
            <Button
              variant="accent"
              size="sm"
              isLoading={isAdding}
              onClick={handleAddToCart}
              aria-label={`Add ${plant.name} to cart for $${plant.price.toFixed(2)}`}
            >
              {isAdding ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </div>

      </div>

    </article>
  );
}

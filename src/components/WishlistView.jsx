import React from 'react';
import Button from './Button.jsx';
import Badge from './Badge.jsx';
import Rating from './Rating.jsx';
import PlantImage from './PlantImage.jsx';

/**
 * Dedicated Wishlist View Component.
 * 
 * @param {Object} props
 * @param {Array<number|string>} props.wishlistIds Array of wishlisted plant IDs
 * @param {Array<Object>} props.plants All available catalog specimens
 * @param {Function} props.onToggleWishlist Handler to toggle/remove wishlist item
 * @param {Function} props.onAddToCart Handler to move item to cart
 * @param {Function} props.onSelectPlant Handler to view plant details
 * @param {Function} props.onBack Return to catalog callback
 */
export default function WishlistView({
  wishlistIds = [],
  plants = [],
  onToggleWishlist,
  onAddToCart,
  onSelectPlant,
  onBack,
}) {
  const wishlistedPlants = plants.filter((p) => wishlistIds.includes(p.id));

  return (
    <div style={{ backgroundColor: 'var(--color-white)', minHeight: '80vh', padding: 'var(--space-2xl) 0 var(--space-3xl) 0' }}>
      <div className="container">
        
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-forest)',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0,
              fontSize: 'var(--text-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            ← Back to Marketplace
          </button>
        </div>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-md)',
          paddingBottom: 'var(--space-lg)',
          borderBottom: '1px solid var(--color-concrete-light)',
          marginBottom: 'var(--space-2xl)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Badge variant="amber">Saved Favorites</Badge>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-light)' }}>
                {wishlistedPlants.length} {wishlistedPlants.length === 1 ? 'Specimen' : 'Specimens'}
              </span>
            </div>
            <h1 style={{
              fontSize: 'var(--text-3xl)',
              color: 'var(--color-forest)',
              margin: 0,
            }}>
              My Botanical Wishlist
            </h1>
          </div>

          {wishlistedPlants.length > 0 && (
            <Button variant="outline" size="sm" onClick={onBack}>
              + Discover More Plants
            </Button>
          )}
        </div>

        {/* Empty State */}
        {wishlistedPlants.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-3xl) var(--space-md)',
            backgroundColor: 'var(--color-off-white)',
            borderRadius: 'var(--radius-2xl)',
            border: '1px solid var(--color-concrete-light)',
            maxWidth: '560px',
            margin: '0 auto',
          }}>
            <div style={{ fontSize: '48px', marginBottom: 'var(--space-md)' }}>💚</div>
            <h2 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-forest)', marginBottom: 'var(--space-xs)' }}>
              Your Wishlist is Empty
            </h2>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-charcoal-muted)',
              lineHeight: 1.6,
              marginBottom: 'var(--space-xl)',
            }}>
              Explore our 100 curated indoor and garden plants. Click the heart icon on any plant card to save your favorite botanical companions for later.
            </p>
            <Button variant="accent" size="lg" onClick={onBack}>
              Explore Botanical Marketplace
            </Button>
          </div>
        ) : (
          /* Wishlist Grid */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 'var(--space-xl)',
          }}>
            {wishlistedPlants.map((plant) => (
              <div
                key={plant.id}
                style={{
                  backgroundColor: 'var(--color-white)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--color-concrete-light)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
                }}
              >
                {/* Media */}
                <div
                  style={{ position: 'relative', aspectRatio: '1 / 1', backgroundColor: '#F0F3EC', cursor: 'pointer' }}
                  onClick={() => onSelectPlant(plant)}
                >
                  <PlantImage
                    src={plant.image}
                    alt={plant.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(plant);
                    }}
                    aria-label={`Remove ${plant.name} from wishlist`}
                    title="Remove from Wishlist"
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid var(--color-concrete-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: 'var(--color-charcoal-muted)',
                    }}
                  >
                    ✕
                  </button>
                </div>

                {/* Content */}
                <div style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-charcoal-light)', fontWeight: 600, marginBottom: '2px' }}>
                    {plant.category}
                  </div>
                  
                  <h3
                    style={{
                      fontSize: 'var(--text-base)',
                      color: 'var(--color-forest)',
                      margin: '0 0 2px 0',
                      cursor: 'pointer',
                    }}
                    onClick={() => onSelectPlant(plant)}
                  >
                    {plant.name}
                  </h3>

                  <div style={{ fontSize: '11px', fontStyle: 'italic', color: 'var(--color-charcoal-muted)', marginBottom: '8px' }}>
                    {plant.scientificName}
                  </div>

                  <div style={{ marginBottom: '8px' }}>
                    <Rating value={plant.rating} reviewCount={plant.reviewCount} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: 'auto', marginBottom: 'var(--space-md)' }}>
                    <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-forest)' }}>
                      ${plant.price.toFixed(2)}
                    </span>
                    {plant.originalPrice && (
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-concrete)', textDecoration: 'line-through' }}>
                        ${plant.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                      variant="accent"
                      size="sm"
                      style={{ flex: 1 }}
                      onClick={() => onAddToCart(plant, 1)}
                    >
                      🛒 Move to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectPlant(plant)}
                    >
                      Details
                    </Button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

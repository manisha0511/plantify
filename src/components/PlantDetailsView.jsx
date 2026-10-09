import React, { useState } from 'react';
import Badge from './Badge.jsx';
import Rating from './Rating.jsx';
import Button from './Button.jsx';
import PlantCard from './PlantCard.jsx';
import PlantImage from './PlantImage.jsx';

/**
 * Dedicated Plant Details Page / View.
 * 
 * @param {Object} props
 * @param {Object} props.plant Selected botanical specimen
 * @param {Function} props.onBack Return to catalog callback
 * @param {Function} props.onAddToCart Add to cart handler with quantity
 * @param {boolean} [props.isWishlisted=false] Controlled wishlist state
 * @param {Function} props.onToggleWishlist Wishlist toggle handler
 * @param {Function} [props.onSelectPlant] Handler for navigating to another plant
 * @param {Array} [props.relatedPlants=[]] Related species in the same category
 * @param {Array} [props.wishlistIds=[]] Current wishlisted plant IDs
 */
export default function PlantDetailsView({
  plant,
  onBack,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist,
  onSelectPlant,
  relatedPlants = [],
  wishlistIds = [],
  onAskAi,
  onDiagnoseHealth,
  onAddToMyPlants,
}) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('care'); // 'care' | 'details' | 'shipping'

  if (!plant) {
    return (
      <div className="container" style={{ padding: 'var(--space-3xl) 0', textAlign: 'center' }}>
        <h2>Specimen Not Found</h2>
        <p style={{ color: 'var(--color-charcoal-muted)', marginBottom: 'var(--space-lg)' }}>
          The requested botanical plant could not be retrieved.
        </p>
        <Button variant="primary" onClick={onBack}>
          ← Back to Marketplace
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      if (onAddToCart) onAddToCart(plant, quantity);
    }, 350);
  };

  const discountPercent = plant.originalPrice
    ? Math.round(((plant.originalPrice - plant.price) / plant.originalPrice) * 100)
    : null;

  return (
    <div style={{ backgroundColor: 'var(--color-white)', minHeight: '80vh', paddingBottom: 'var(--space-3xl)' }}>
      <div className="container" style={{ paddingTop: 'var(--space-xl)' }}>
        
        {/* Breadcrumb Navigation Bar */}
        <nav aria-label="Breadcrumb" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-charcoal-light)',
          marginBottom: 'var(--space-xl)',
          flexWrap: 'wrap',
        }}>
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
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            ← Back to Catalog
          </button>
          <span>/</span>
          <span>{plant.category || 'Plants'}</span>
          <span>/</span>
          <span style={{ color: 'var(--color-charcoal)', fontWeight: 600 }}>{plant.name}</span>
        </nav>

        {/* 2-Column Responsive Layout: Media Gallery + Botanical Specs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-3xl)',
          alignItems: 'start',
          marginBottom: 'var(--space-3xl)',
        }}>
          
          {/* Left Column: Image Media & Badges */}
          <div>
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-2xl)',
              overflow: 'hidden',
              backgroundColor: '#F0F3EC',
              border: '1px solid var(--color-concrete-light)',
              boxShadow: 'var(--shadow-md)',
              aspectRatio: '1 / 1',
            }}>
              <PlantImage
                src={plant.image}
                alt={plant.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Status / Category Badge */}
              {plant.badge && (
                <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 2 }}>
                  <Badge variant={plant.badge.variant || 'forest'}>
                    {plant.badge.text}
                  </Badge>
                </div>
              )}

              {/* Verified Observation Source Tag */}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                right: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(8px)',
                borderRadius: 'var(--radius-lg)',
                padding: '8px 14px',
                fontSize: '11px',
                color: 'var(--color-charcoal-muted)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid var(--color-concrete-light)',
              }}>
                <span>🌿 Verified Botanical Observation</span>
                <span style={{ fontWeight: 600, color: 'var(--color-forest)' }}>
                  {plant.source ? plant.source.split(' ')[0] : 'Plantify'}
                </span>
              </div>
            </div>

            {/* Quick Guarantees Micro-Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              marginTop: 'var(--space-lg)',
              textAlign: 'center',
            }}>
              <div style={{ padding: '10px 8px', backgroundColor: 'var(--color-off-white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-concrete-light)' }}>
                <div style={{ fontSize: '18px', marginBottom: '2px' }}>🛡️</div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-forest)' }}>Disease-Free</div>
                <div style={{ fontSize: '10px', color: 'var(--color-charcoal-light)' }}>Nursery certified</div>
              </div>
              <div style={{ padding: '10px 8px', backgroundColor: 'var(--color-off-white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-concrete-light)' }}>
                <div style={{ fontSize: '18px', marginBottom: '2px' }}>📦</div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-forest)' }}>Eco-Packed</div>
                <div style={{ fontSize: '10px', color: 'var(--color-charcoal-light)' }}>Zero-stress transit</div>
              </div>
              <div style={{ padding: '10px 8px', backgroundColor: 'var(--color-off-white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-concrete-light)' }}>
                <div style={{ fontSize: '18px', marginBottom: '2px' }}>🪴</div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-forest)' }}>30-Day Thrive</div>
                <div style={{ fontSize: '10px', color: 'var(--color-charcoal-light)' }}>Free replacement</div>
              </div>
            </div>
          </div>

          {/* Right Column: Plant Info & Purchase Controls */}
          <div>
            
            {/* Category & Pet-Safety Tag */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{
                fontSize: 'var(--text-xs)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 700,
                color: 'var(--color-charcoal-light)',
              }}>
                {plant.category}
              </span>
              <span style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: plant.petFriendly ? '#2E7D32' : 'var(--color-amber)',
                backgroundColor: plant.petFriendly ? '#E8F5E9' : 'var(--color-amber-pale)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
              }}>
                {plant.petFriendly ? '🐾 Pet-Safe Specimen' : '⚠️ Keep Away From Pets'}
              </span>
            </div>

            {/* Plant Titles */}
            <h1 style={{
              fontSize: 'var(--text-3xl)',
              fontFamily: 'var(--font-serif)',
              color: 'var(--color-forest)',
              lineHeight: 1.2,
              marginBottom: '4px',
            }}>
              {plant.name}
            </h1>
            
            <div style={{
              fontSize: 'var(--text-sm)',
              fontStyle: 'italic',
              color: 'var(--color-charcoal-muted)',
              marginBottom: 'var(--space-md)',
            }}>
              {plant.scientificName}
            </div>

            {/* Price & Rating Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              flexWrap: 'wrap',
              gap: '12px',
              paddingBottom: 'var(--space-md)',
              borderBottom: '1px solid var(--color-concrete-light)',
              marginBottom: 'var(--space-lg)',
            }}>
              <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-forest)' }}>
                ${plant.price.toFixed(2)}
              </span>
              
              {plant.originalPrice && (
                <>
                  <span style={{ fontSize: 'var(--text-lg)', color: 'var(--color-concrete)', textDecoration: 'line-through' }}>
                    ${plant.originalPrice.toFixed(2)}
                  </span>
                  {discountPercent && (
                    <Badge variant="amber">{discountPercent}% OFF</Badge>
                  )}
                </>
              )}

              <div style={{ marginLeft: 'auto' }}>
                <Rating value={plant.rating} reviewCount={plant.reviewCount} />
              </div>
            </div>

            {/* Short Botanical Description */}
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-charcoal)',
              lineHeight: 1.65,
              marginBottom: 'var(--space-xl)',
            }}>
              {plant.shortDescription || 'A handpicked nursery specimen nurtured for root vitality, foliage elegance, and effortless indoor care.'}
            </p>

            {/* Botanical Care Specs Grid */}
            <div style={{
              backgroundColor: 'var(--color-off-white)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-lg)',
              border: '1px solid var(--color-concrete-light)',
              marginBottom: 'var(--space-xl)',
            }}>
              <h3 style={{
                fontSize: 'var(--text-xs)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 700,
                color: 'var(--color-forest)',
                marginBottom: 'var(--space-md)',
              }}>
                Botanical Care Requirements
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
              }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ fontSize: '24px' }}>☀️</div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--color-charcoal-light)', textTransform: 'uppercase', fontWeight: 600 }}>Sunlight</div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-forest)' }}>{plant.light || 'Medium Light'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ fontSize: '24px' }}>💧</div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--color-charcoal-light)', textTransform: 'uppercase', fontWeight: 600 }}>Water Schedule</div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-forest)' }}>{plant.water || 'Weekly'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ fontSize: '24px' }}>🏡</div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--color-charcoal-light)', textTransform: 'uppercase', fontWeight: 600 }}>Environment</div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-forest)' }}>{plant.environment || 'Indoor Living'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ fontSize: '24px' }}>🎯</div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--color-charcoal-light)', textTransform: 'uppercase', fontWeight: 600 }}>Care Level</div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-forest)' }}>{plant.difficulty || 'Easy Care'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Row: Quantity Selector + Add to Cart + Wishlist */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 'var(--space-md)',
              marginBottom: 'var(--space-xl)',
            }}>
              
              {/* Quantity Counter */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--color-off-white)',
                border: '1px solid var(--color-concrete-light)',
                borderRadius: 'var(--radius-full)',
                padding: '4px',
              }}>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: 'var(--color-white)',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: quantity <= 1 ? 'var(--color-concrete)' : 'var(--color-forest)',
                    cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  −
                </button>
                <span style={{
                  minWidth: '40px',
                  textAlign: 'center',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 700,
                  color: 'var(--color-forest)',
                }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  disabled={quantity >= 10}
                  aria-label="Increase quantity"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: 'var(--color-white)',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: quantity >= 10 ? 'var(--color-concrete)' : 'var(--color-forest)',
                    cursor: quantity >= 10 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                variant="accent"
                size="lg"
                isLoading={isAdding}
                onClick={handleAddToCart}
                style={{ flex: 1, minWidth: '200px' }}
              >
                {isAdding ? 'Adding...' : `Add to Cart • $${(plant.price * quantity).toFixed(2)}`}
              </Button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => onToggleWishlist(plant)}
                aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                style={{
                  height: '48px',
                  padding: '0 18px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-concrete-light)',
                  backgroundColor: isWishlisted ? 'var(--color-amber-pale)' : 'var(--color-white)',
                  color: isWishlisted ? 'var(--color-amber)' : 'var(--color-forest)',
                  fontWeight: 600,
                  fontSize: 'var(--text-sm)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <svg
                  width="20"
                  height="20"
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
                <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
              </button>

              {onAskAi && (
                <button
                  type="button"
                  onClick={() => onAskAi(plant)}
                  style={{
                    height: '48px',
                    padding: '0 18px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid #B7D1C2',
                    backgroundColor: '#E8F5E9',
                    color: '#1B3B2B',
                    fontWeight: 600,
                    fontSize: 'var(--text-sm)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all var(--transition-fast)',
                  }}
                  title="Ask AI Botanist about care for this plant"
                >
                  <span role="img" aria-label="sprout">🌱</span>
                  <span>Ask AI Care</span>
                </button>
              )}

              {onDiagnoseHealth && (
                <button
                  type="button"
                  onClick={() => onDiagnoseHealth(plant)}
                  style={{
                    height: '48px',
                    padding: '0 18px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#F8FAFC',
                    color: '#334155',
                    fontWeight: 600,
                    fontSize: 'var(--text-sm)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all var(--transition-fast)',
                  }}
                  title="Upload a photo to diagnose health for this specimen"
                >
                  <span role="img" aria-label="microscope">🔬</span>
                  <span>Diagnose Health</span>
                </button>
              )}

              {onAddToMyPlants && (
                <button
                  type="button"
                  onClick={() => onAddToMyPlants(plant)}
                  style={{
                    height: '48px',
                    padding: '0 18px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid #A7F3D0',
                    backgroundColor: '#ECFDF5',
                    color: '#065F46',
                    fontWeight: 600,
                    fontSize: 'var(--text-sm)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all var(--transition-fast)',
                  }}
                  title="Add to My Plants collection for care reminders"
                >
                  <span role="img" aria-label="potted plant">🪴</span>
                  <span>Track in My Plants</span>
                </button>
              )}

            </div>

            {/* Tags / Botanical Metadata */}
            {Array.isArray(plant.tags) && plant.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-charcoal-light)', fontWeight: 600 }}>
                  Tags:
                </span>
                {plant.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: '11px',
                      backgroundColor: 'var(--color-off-white)',
                      color: 'var(--color-forest)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--color-concrete-light)',
                    }}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

          </div>

        </div>

        {/* Related Species Section */}
        {relatedPlants.length > 0 && (
          <section style={{
            marginTop: 'var(--space-3xl)',
            paddingTop: 'var(--space-2xl)',
            borderTop: '1px solid var(--color-concrete-light)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
              <div>
                <Badge variant="sage" style={{ marginBottom: '4px' }}>
                  Similar Specimens
                </Badge>
                <h2 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-forest)', margin: 0 }}>
                  More in {plant.category}
                </h2>
              </div>
              <Button variant="outline" size="sm" onClick={onBack}>
                Explore All Plants →
              </Button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: 'var(--space-lg)',
            }}>
              {relatedPlants.slice(0, 4).map((rel) => (
                <PlantCard
                  key={rel.id}
                  plant={rel}
                  isWishlisted={wishlistIds.includes(rel.id)}
                  onAddToCart={(p) => onAddToCart(p, 1)}
                  onToggleWishlist={onToggleWishlist}
                  onSelectPlant={onSelectPlant}
                />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import Button from './Button.jsx';
import Badge from './Badge.jsx';
import PlantImage from './PlantImage.jsx';
import { useAuth } from '../context/AuthContext';
import plantifyApi from '../services/plantifyApi';

/**
 * Dedicated Shopping Cart & Real Checkout View Component.
 */
export default function CartView({
  cartItems = [],
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onBack,
  onSelectPlant,
  onNavigate,
}) {
  const { user, isAuthenticated, openLoginModal } = useAuth();

  // Checkout modal & state
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // New inline address form state if user has no saved addresses or wants a new one
  const [newAddressForm, setNewAddressForm] = useState({
    recipientName: user?.fullName || '',
    phone: user?.phone || '',
    streetAddress: '',
    landmark: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  // Confirmed Order result
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Subtotal Calculation (Frontend preview with precise 2-decimal rounding)
  const rawSubtotal = cartItems.reduce(
    (sum, item) => sum + ((parseFloat(item.plant.price) || 0) * item.quantity),
    0
  );
  const subtotal = Math.round((rawSubtotal + Number.EPSILON) * 100) / 100;
  const shipping = subtotal >= 500 || subtotal === 0 ? 0 : 40;
  const total = Math.round(((subtotal + shipping) + Number.EPSILON) * 100) / 100;

  const handleStartCheckout = async () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    setShowCheckoutModal(true);
    setCheckoutError('');
    setShowNewAddressForm(false);
    try {
      setLoadingAddresses(true);
      const userAddresses = await plantifyApi.getAddresses();
      setAddresses(userAddresses || []);
      const defaultAddr = userAddresses?.find(a => a.default) || userAddresses?.[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
        setShowNewAddressForm(false);
      } else {
        setSelectedAddressId(null);
        setShowNewAddressForm(true);
      }
    } catch (err) {
      console.error('Failed to load addresses:', err);
      setShowNewAddressForm(true);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setCheckoutError('');

    if (cartItems.length === 0) {
      setCheckoutError('Your cart is empty. Please add plants before checking out.');
      return;
    }

    let finalAddressId = selectedAddressId;

    try {
      setIsSubmittingOrder(true);

      // If user toggled new address or has no saved address, validate and create it first
      if (showNewAddressForm || !finalAddressId) {
        if (!newAddressForm.recipientName.trim() || !newAddressForm.phone.trim() || !newAddressForm.streetAddress.trim() || !newAddressForm.city.trim() || !newAddressForm.state.trim() || !newAddressForm.postalCode.trim()) {
          setCheckoutError('Please fill in all required delivery address fields marked with *');
          setIsSubmittingOrder(false);
          return;
        }
        const createdAddr = await plantifyApi.createAddress({
          ...newAddressForm,
          isDefault: addresses.length === 0
        });
        finalAddressId = createdAddr.id;
      }

      if (!finalAddressId) {
        setCheckoutError('Please select or provide a delivery address.');
        setIsSubmittingOrder(false);
        return;
      }

      // Synchronize cart with backend first to ensure items are persisted
      const guestItems = cartItems.map(item => ({
        productId: item.plant.id,
        quantity: item.quantity,
      }));
      await plantifyApi.mergeGuestCart(guestItems);

      // Generate unique idempotency key to prevent double charging/ordering on retries
      const idempotencyKey = 'PLNT-IDEMP-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);

      // Place order via Spring Boot API
      const order = await plantifyApi.createOrder({
        addressId: finalAddressId,
        paymentMethod,
        notes: deliveryNotes.trim() || null,
        idempotencyKey,
      });

      // Clear local cart
      if (onClearCart) onClearCart();

      setShowCheckoutModal(false);
      setConfirmedOrder(order);
    } catch (err) {
      setCheckoutError(err.message || 'Failed to place order. Please check item stock.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  if (confirmedOrder) {
    return (
      <div style={{ backgroundColor: 'var(--color-white)', minHeight: '80vh', padding: 'var(--space-3xl) 0' }}>
        <div className="container" style={{ maxWidth: '680px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌿</div>
          <Badge variant="forest">ORDER CONFIRMED</Badge>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-forest)', margin: '1rem 0 0.5rem 0' }}>
            Thank You for Growing With Us!
          </h1>
          <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
            Your botanical order <strong>#{confirmedOrder.orderNumber}</strong> has been received and is being prepared with organic care.
          </p>

          <div style={{ background: 'var(--color-off-white)', borderRadius: 'var(--radius-md)', padding: '1.5rem', textAlign: 'left', marginBottom: '1.5rem', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--color-charcoal-muted)' }}>Status:</span>
              <strong style={{ color: 'var(--color-forest)' }}>{confirmedOrder.orderStatus}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--color-charcoal-muted)' }}>Payment Method:</span>
              <strong>{confirmedOrder.paymentMethod} ({confirmedOrder.paymentStatus})</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--color-charcoal-muted)' }}>Total Amount:</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--color-forest)' }}>₹{confirmedOrder.totalAmount}</strong>
            </div>
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--color-charcoal-muted)', display: 'block', marginBottom: '0.2rem' }}>Delivery Address:</span>
              <div style={{ color: 'var(--color-charcoal)' }}>{confirmedOrder.deliveryAddressSnapshot}</div>
            </div>
          </div>

          {/* Itemized Botanical Order Snapshot */}
          {confirmedOrder.items && confirmedOrder.items.length > 0 && (
            <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', padding: '1.5rem', textAlign: 'left', marginBottom: '2rem', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--color-forest)', margin: '0 0 1rem 0', fontFamily: 'var(--font-heading)' }}>
                Plants in This Order ({confirmedOrder.items.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {confirmedOrder.items.map((it) => (
                  <div key={it.id || it.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F0F0EE', paddingBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                        <PlantImage src={it.productImage} alt={it.productName} style={{ width: '48px', height: '48px', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-forest)' }}>{it.productName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>₹{it.unitPrice} × {it.quantity}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-forest)' }}>₹{it.subtotal}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ color: 'var(--color-charcoal-muted)' }}>Items Subtotal:</span>
                  <span>₹{confirmedOrder.subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ color: 'var(--color-charcoal-muted)' }}>Shipping Charges:</span>
                  <span>{confirmedOrder.shippingCharge > 0 ? `₹${confirmedOrder.shippingCharge}` : 'Free'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-forest)', marginTop: '0.5rem', borderTop: '1px dashed var(--color-border)', paddingTop: '0.5rem' }}>
                  <span>Final Total:</span>
                  <span>₹{confirmedOrder.totalAmount}</span>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Button variant="forest" onClick={() => onNavigate && onNavigate('account')}>
              View in My Orders
            </Button>
            <Button variant="outline" onClick={onBack}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            ← Continue Shopping
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
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-forest)',
              fontSize: 'var(--text-3xl)',
              margin: '0 0 6px 0',
            }}>
              Your Shopping Cart
            </h1>
            <p style={{
              color: 'var(--color-charcoal-muted)',
              margin: 0,
              fontSize: 'var(--text-sm)',
            }}>
              {cartItems.length} {cartItems.length === 1 ? 'specimen' : 'specimens'} selected for your living collection
            </p>
          </div>

          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={onClearCart}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-charcoal-muted)',
                fontSize: 'var(--text-xs)',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Empty State */}
        {cartItems.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-4xl) var(--space-md)',
            backgroundColor: 'var(--color-off-white)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--color-concrete-light)',
            margin: 'var(--space-xl) 0',
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 'var(--space-md)' }}>🪴</div>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-forest)',
              fontSize: 'var(--text-2xl)',
              margin: '0 0 var(--space-sm) 0',
            }}>
              Your botanical cart is empty
            </h2>
            <p style={{
              color: 'var(--color-charcoal-muted)',
              maxWidth: '460px',
              margin: '0 auto var(--space-xl) auto',
              fontSize: 'var(--text-base)',
              lineHeight: 1.6,
            }}>
              Explore our curated botanical catalogue of air-purifying indoor specimens, vibrant blossoms, and rare tropical plants.
            </p>
            <Button
              variant="forest"
              size="lg"
              onClick={onBack}
            >
              Discover Plants
            </Button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)',
            gap: 'var(--space-2xl)',
            alignItems: 'start',
          }}>
            
            {/* Left: Cart Line Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              {cartItems.map((item) => {
                const itemTotal = item.plant.price * item.quantity;
                return (
                  <div
                    key={item.plant.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '100px 1fr auto',
                      gap: 'var(--space-lg)',
                      padding: 'var(--space-lg)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-white)',
                      border: '1px solid var(--color-concrete-light)',
                      alignItems: 'center',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    {/* Plant Thumbnail */}
                    <div
                      style={{
                        position: 'relative',
                        width: '100px',
                        height: '100px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        backgroundColor: 'var(--color-off-white)',
                      }}
                      onClick={() => onSelectPlant && onSelectPlant(item.plant)}
                    >
                      <PlantImage
                        src={item.plant.image}
                        alt={item.plant.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <h3
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'var(--text-lg)',
                            color: 'var(--color-forest)',
                            margin: 0,
                            cursor: 'pointer',
                          }}
                          onClick={() => onSelectPlant && onSelectPlant(item.plant)}
                        >
                          {item.plant.name}
                        </h3>
                        {item.plant.stockQuantity !== undefined && item.plant.stockQuantity <= 0 && (
                          <Badge variant="amber">Out of Stock</Badge>
                        )}
                        {item.plant.stockQuantity !== undefined && item.plant.stockQuantity > 0 && item.quantity > item.plant.stockQuantity && (
                          <Badge variant="amber">Only {item.plant.stockQuantity} left</Badge>
                        )}
                      </div>

                      <div style={{
                        fontFamily: 'var(--font-body)',
                        fontStyle: 'italic',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-charcoal-muted)',
                        marginBottom: 'var(--space-sm)',
                      }}>
                        {item.plant.scientificName}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                        <div style={{
                          fontWeight: 700,
                          fontSize: 'var(--text-base)',
                          color: 'var(--color-forest)',
                        }}>
                          ₹{item.plant.price}
                        </div>

                        {/* Quantity Controls */}
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: '1px solid var(--color-concrete-light)',
                          borderRadius: 'var(--radius-full)',
                          overflow: 'hidden',
                        }}>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.plant.id, item.quantity - 1)}
                            style={{
                              width: '28px',
                              height: '28px',
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            -
                          </button>
                          <span style={{
                            padding: '0 10px',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 600,
                          }}>
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            disabled={item.plant.stockQuantity !== undefined && item.quantity >= item.plant.stockQuantity}
                            onClick={() => onUpdateQuantity(item.plant.id, item.quantity + 1)}
                            style={{
                              width: '28px',
                              height: '28px',
                              border: 'none',
                              background: 'transparent',
                              cursor: (item.plant.stockQuantity !== undefined && item.quantity >= item.plant.stockQuantity) ? 'not-allowed' : 'pointer',
                              opacity: (item.plant.stockQuantity !== undefined && item.quantity >= item.plant.stockQuantity) ? 0.35 : 1,
                              fontWeight: 'bold',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            title={item.plant.stockQuantity !== undefined && item.quantity >= item.plant.stockQuantity ? 'Maximum available stock reached' : 'Add one more'}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Total & Remove */}
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', alignItems: 'flex-end' }}>
                      <div style={{
                        fontSize: 'var(--text-lg)',
                        fontWeight: 700,
                        color: 'var(--color-forest)',
                      }}>
                        ₹{itemTotal.toFixed(2)}
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveFromCart(item.plant.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#DC2626',
                          cursor: 'pointer',
                          padding: 0,
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Order Summary Card */}
            <div style={{
              backgroundColor: 'var(--color-off-white)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-2xl)',
              border: '1px solid var(--color-concrete-light)',
              boxShadow: 'var(--shadow-sm)',
              position: 'sticky',
              top: '100px',
            }}>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-xl)',
                color: 'var(--color-forest)',
                marginTop: 0,
                marginBottom: 'var(--space-lg)',
                borderBottom: '1px solid var(--color-concrete-light)',
                paddingBottom: 'var(--space-md)',
              }}>
                Order Summary
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-charcoal)' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>₹{subtotal.toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-charcoal)' }}>
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <strong style={{ color: '#166534' }}>FREE</strong> : `₹${shipping.toFixed(2)}`}</span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 700,
                  color: 'var(--color-forest)',
                  borderTop: '2px solid var(--color-concrete-light)',
                  paddingTop: 'var(--space-md)',
                  marginTop: 'var(--space-xs)',
                }}>
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                variant="accent"
                size="lg"
                style={{ width: '100%' }}
                disabled={cartItems.some(i => i.plant.stockQuantity !== undefined && (i.plant.stockQuantity <= 0 || i.quantity > i.plant.stockQuantity))}
                onClick={handleStartCheckout}
              >
                Proceed to Checkout
              </Button>

              <div style={{ marginTop: 'var(--space-md)', fontSize: '0.75rem', color: 'var(--color-charcoal-muted)', textAlign: 'center' }}>
                🔒 Secure Spring Boot backend checkout • Free delivery on orders over ₹500
              </div>
            </div>
          </div>
        )}

      </div>

      {/* CHECKOUT MODAL */}
      {showCheckoutModal && (
        <div className="modal-overlay" onClick={() => setShowCheckoutModal(false)} role="dialog" aria-modal="true">
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <button className="modal-close-btn" onClick={() => setShowCheckoutModal(false)}>&times;</button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🪴</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-forest)', margin: 0 }}>
                Review & Place Order
              </h2>
            </div>
            <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.85rem', marginTop: 0, marginBottom: '1.25rem' }}>
              Confirm your botanical items, delivery location, and payment preference.
            </p>

            {checkoutError && (
              <div style={{ background: '#FDF2F2', color: '#991B1B', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem', border: '1px solid #FCA5A5' }}>
                ⚠️ {checkoutError}
              </div>
            )}

            <form onSubmit={handlePlaceOrder}>
              {/* 1. Itemized Cart Summary */}
              <div style={{ marginBottom: '1.5rem', background: 'var(--color-off-white)', borderRadius: 'var(--radius-sm)', padding: '1rem', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '0.9rem', color: 'var(--color-forest)', margin: 0, fontWeight: 700 }}>
                    1. Items in This Order ({cartItems.length})
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>
                    {cartItems.reduce((acc, i) => acc + i.quantity, 0)} total plants
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '160px', overflowY: 'auto', paddingRight: '4px' }}>
                  {cartItems.map((item) => (
                    <div key={item.plant.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', padding: '0.5rem 0.75rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                          <PlantImage src={item.plant.image} alt={item.plant.name} style={{ width: '36px', height: '36px', objectFit: 'cover' }} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-forest)' }}>{item.plant.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)' }}>Qty: {item.quantity} × ₹{item.plant.price}</div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-forest)' }}>
                        ₹{(item.plant.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Delivery Address Selection */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '0.95rem', color: 'var(--color-forest)', margin: 0 }}>
                    2. Delivery Address
                  </h3>
                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                      style={{ background: 'none', border: 'none', color: 'var(--color-amber)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                    >
                      {showNewAddressForm ? '← Choose Saved Address' : '+ Add New Address'}
                    </button>
                  )}
                </div>

                {loadingAddresses ? (
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>Loading addresses...</div>
                ) : (!showNewAddressForm && addresses.length > 0) ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          padding: '0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          border: selectedAddressId === addr.id ? '2px solid var(--color-amber)' : '1px solid var(--color-border)',
                          cursor: 'pointer',
                          background: selectedAddressId === addr.id ? 'var(--color-amber-pale)' : '#FFFFFF'
                        }}
                      >
                        <input
                          type="radio"
                          name="deliveryAddress"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          style={{ marginTop: '3px' }}
                        />
                        <div style={{ fontSize: '0.85rem' }}>
                          <strong>{addr.recipientName}</strong> (📞 {addr.phone})<br />
                          {addr.streetAddress}{addr.landmark ? `, ${addr.landmark}` : ''}, {addr.city}, {addr.state} - {addr.postalCode}
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  // Inline address fields if user has no saved addresses or clicked Add New Address
                  <div style={{ background: 'var(--color-off-white)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-forest)', fontWeight: 600, marginBottom: '0.5rem' }}>
                      Enter New Delivery Destination
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="Recipient Name *"
                        required
                        value={newAddressForm.recipientName}
                        onChange={(e) => setNewAddressForm(a => ({ ...a, recipientName: e.target.value }))}
                        style={{ padding: '0.55rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number *"
                        required
                        value={newAddressForm.phone}
                        onChange={(e) => setNewAddressForm(a => ({ ...a, phone: e.target.value }))}
                        style={{ padding: '0.55rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Street Address, House/Flat No. *"
                      required
                      value={newAddressForm.streetAddress}
                      onChange={(e) => setNewAddressForm(a => ({ ...a, streetAddress: e.target.value }))}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--color-border)', marginBottom: '0.5rem', boxSizing: 'border-box', fontSize: '0.85rem' }}
                    />
                    <input
                      type="text"
                      placeholder="Landmark (Optional)"
                      value={newAddressForm.landmark}
                      onChange={(e) => setNewAddressForm(a => ({ ...a, landmark: e.target.value }))}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--color-border)', marginBottom: '0.5rem', boxSizing: 'border-box', fontSize: '0.85rem' }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="City *"
                        required
                        value={newAddressForm.city}
                        onChange={(e) => setNewAddressForm(a => ({ ...a, city: e.target.value }))}
                        style={{ padding: '0.55rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}
                      />
                      <input
                        type="text"
                        placeholder="State *"
                        required
                        value={newAddressForm.state}
                        onChange={(e) => setNewAddressForm(a => ({ ...a, state: e.target.value }))}
                        style={{ padding: '0.55rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}
                      />
                      <input
                        type="text"
                        placeholder="Postal Code *"
                        required
                        value={newAddressForm.postalCode}
                        onChange={(e) => setNewAddressForm(a => ({ ...a, postalCode: e.target.value }))}
                        style={{ padding: '0.55rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Payment Method Selection */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', color: 'var(--color-forest)', margin: '0 0 0.5rem 0' }}>
                  3. Payment Method
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', border: paymentMethod === 'CASH_ON_DELIVERY' ? '2px solid var(--color-amber)' : '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: paymentMethod === 'CASH_ON_DELIVERY' ? 'var(--color-amber-pale)' : '#FFFFFF' }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CASH_ON_DELIVERY"
                      checked={paymentMethod === 'CASH_ON_DELIVERY'}
                      onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                    />
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>💵 Cash on Delivery (COD)</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)' }}>Pay with cash upon arrival of your healthy botanical specimens.</div>
                    </div>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', border: paymentMethod === 'PAY_ON_DELIVERY_UPI' ? '2px solid var(--color-amber)' : '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: paymentMethod === 'PAY_ON_DELIVERY_UPI' ? 'var(--color-amber-pale)' : '#FFFFFF' }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="PAY_ON_DELIVERY_UPI"
                      checked={paymentMethod === 'PAY_ON_DELIVERY_UPI'}
                      onChange={() => setPaymentMethod('PAY_ON_DELIVERY_UPI')}
                    />
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>📱 UPI / QR on Delivery</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)' }}>Scan delivery partner's QR code at doorstep upon delivery.</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* 4. Delivery Instructions */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Special Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Leave with reception, call before delivery"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', boxSizing: 'border-box', fontSize: '0.85rem' }}
                />
              </div>

              {/* 5. Authoritative Final Amount Summary */}
              <div style={{ background: 'var(--color-off-white)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>
                  <span>Specimens Subtotal:</span>
                  <span style={{ color: 'var(--color-charcoal)' }}>₹{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>
                  <span>Shipping Charges:</span>
                  <span style={{ color: shipping === 0 ? '#166534' : 'var(--color-charcoal)' }}>
                    {shipping === 0 ? 'FREE (Orders ₹500+)' : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-forest)' }}>Final Amount to Pay:</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-forest)' }}>₹{total.toFixed(2)}</div>
                </div>
              </div>

              <Button
                type="submit"
                variant="accent"
                disabled={isSubmittingOrder || cartItems.length === 0}
                style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
              >
                {isSubmittingOrder ? 'Processing Order...' : `Confirm & Place Order (₹${total.toFixed(2)})`}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

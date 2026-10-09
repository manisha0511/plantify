import React from 'react';
import CartView from '../components/CartView.jsx';

/**
 * Checkout page component.
 * Integrates directly with the database-backed cart and authenticated checkout workflow.
 */
export default function CheckoutPage({
  cartItems = [],
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onBack,
  onSelectPlant,
  onNavigate,
}) {
  return (
    <div className="checkout-page">
      <CartView
        cartItems={cartItems}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveFromCart={onRemoveFromCart}
        onClearCart={onClearCart}
        onBack={onBack}
        onSelectPlant={onSelectPlant}
        onNavigate={onNavigate}
      />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import plantifyApi from '../../services/plantifyApi';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import PlantImage from '../../components/PlantImage';

export default function OrderDetailsPage({ orderId, onBack }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    if (!orderId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await plantifyApi.getOrderById(orderId);
      setOrder(data);
    } catch (err) {
      setError(err.message || 'Failed to load order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      setCancelling(true);
      await plantifyApi.cancelOrder(order.id);
      fetchOrder();
    } catch (err) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading order details...</div>;
  }

  if (error || !order) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#DC2626' }}>
        <p>{error || 'Order not found.'}</p>
        {onBack && <Button variant="outline" size="sm" onClick={onBack}>← Back to Orders</Button>}
      </div>
    );
  }

  return (
    <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
      {onBack && (
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: 'var(--color-forest)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', marginBottom: '1rem', padding: 0 }}
        >
          ← Back to Orders
        </button>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-forest)', margin: 0 }}>
          Order #{order.orderNumber}
        </h2>
        <Badge variant={order.orderStatus === 'CONFIRMED' ? 'forest' : 'amber'}>
          {order.orderStatus}
        </Badge>
      </div>

      <div style={{ background: 'var(--color-off-white)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
        <div><strong>Delivery Address:</strong> {order.deliveryAddressSnapshot}</div>
        <div style={{ marginTop: '0.5rem' }}><strong>Payment:</strong> {order.paymentMethod} ({order.paymentStatus})</div>
        {order.notes && <div style={{ marginTop: '0.25rem' }}><strong>Notes:</strong> {order.notes}</div>}
      </div>

      <h3 style={{ fontSize: '1rem', color: 'var(--color-forest)', marginBottom: '0.75rem' }}>Items Ordered</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {order.items?.map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '45px', height: '45px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden' }}>
                <PlantImage src={item.productImage} alt={item.productName} style={{ width: '45px', height: '45px', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--color-forest)' }}>{item.productName}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>₹{item.unitPrice} × {item.quantity}</div>
              </div>
            </div>
            <div style={{ fontWeight: 700, color: 'var(--color-forest)' }}>₹{item.subtotal}</div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '2px solid var(--color-border)', paddingTop: '0.75rem', fontSize: '0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <span>Subtotal:</span>
          <span>₹{order.subtotal}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span>Shipping:</span>
          <span>{order.shippingCharge > 0 ? `₹${order.shippingCharge}` : 'Free'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-forest)' }}>
          <span>Total:</span>
          <span>₹{order.totalAmount}</span>
        </div>
      </div>

      {(order.orderStatus === 'PENDING' || order.orderStatus === 'CONFIRMED') && (
        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
          <Button
            variant="amber"
            size="sm"
            disabled={cancelling}
            onClick={handleCancel}
          >
            {cancelling ? 'Cancelling...' : 'Cancel Order'}
          </Button>
        </div>
      )}
    </div>
  );
}

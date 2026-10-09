import React, { useState, useEffect } from 'react';
import plantifyApi from '../../services/plantifyApi';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import PlantImage from '../../components/PlantImage';

export default function OrdersPage({ onNavigateHome }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await plantifyApi.getMyOrders();
      setOrders(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? Stock will be safely returned to inventory.')) return;
    try {
      setCancellingId(orderId);
      await plantifyApi.cancelOrder(orderId);
      fetchOrders();
    } catch (err) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'forest';
      case 'PROCESSING': return 'amber';
      case 'SHIPPED': return 'terracotta';
      case 'DELIVERED': return 'forest';
      case 'CANCELLED': return 'charcoal';
      default: return 'outline';
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-charcoal-muted)' }}>Loading orders...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#DC2626' }}>
        <p>{error}</p>
        <Button variant="outline" size="sm" onClick={fetchOrders}>Retry</Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📦</div>
        <h3 style={{ margin: 0, color: 'var(--color-forest)' }}>No orders placed yet</h3>
        <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Discover our verified botanical collections and grow your indoor jungle.
        </p>
        {onNavigateHome && <Button variant="forest" size="sm" onClick={onNavigateHome}>Start Shopping</Button>}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {orders.map((order) => (
        <div key={order.id} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>
                ORDER #{order.orderNumber} • {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-forest)', marginTop: '0.2rem' }}>
                ₹{order.totalAmount}
              </div>
            </div>
            <Badge variant={getStatusVariant(order.orderStatus)}>{order.orderStatus}</Badge>
          </div>

          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {order.items?.map((item) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-off-white)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ width: '40px', height: '40px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden' }}>
                  <PlantImage src={item.productImage} alt={item.productName} style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-forest)' }}>{item.productName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)' }}>Qty: {item.quantity} × ₹{item.unitPrice}</div>
                </div>
              </div>
            ))}
          </div>

          {(order.orderStatus === 'PENDING' || order.orderStatus === 'CONFIRMED') && (
            <div style={{ marginTop: '0.75rem', textAlign: 'right' }}>
              <Button
                variant="amber"
                size="sm"
                disabled={cancellingId === order.id}
                onClick={() => handleCancel(order.id)}
              >
                {cancellingId === order.id ? 'Cancelling...' : 'Cancel Order'}
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

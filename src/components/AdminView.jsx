import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import plantifyApi from '../services/plantifyApi';
import Button from './Button';
import Badge from './Badge';
import PlantImage from './PlantImage';

export default function AdminView({ onNavigateHome }) {
  const { user, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('stats'); // 'stats' | 'products' | 'orders'
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Products state
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [searchProductQuery, setSearchProductQuery] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    categorySlug: 'indoor-plants',
    scientificName: '',
    price: '',
    originalPrice: '',
    image: '',
    light: 'Bright Indirect',
    water: 'Moderate',
    environment: 'Indoor',
    difficulty: 'Easy',
    stockQuantity: 50,
    isActive: true,
    petFriendly: false,
    description: '',
  });
  const [productError, setProductError] = useState('');
  const [categories, setCategories] = useState([]);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  useEffect(() => {
    if (isAdmin) {
      loadStats();
      loadCategories();
      loadProducts();
      loadOrders();
    }
  }, [isAdmin]);

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const data = await plantifyApi.getAdminStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await plantifyApi.getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      const data = await plantifyApi.getAdminProducts();
      setProducts(data || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const data = await plantifyApi.getAdminOrders();
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleToggleProductActive = async (id) => {
    try {
      await plantifyApi.toggleProductActive(id);
      loadProducts();
      loadStats();
    } catch (err) {
      alert(err.message || 'Failed to toggle product status');
    }
  };

  const openProductModal = (prod = null) => {
    setEditingProduct(prod);
    if (prod) {
      setProductForm({
        name: prod.name,
        categorySlug: prod.categorySlug || 'indoor-plants',
        scientificName: prod.scientificName || '',
        price: prod.price,
        originalPrice: prod.originalPrice || '',
        image: prod.image || '',
        light: prod.light || 'Bright Indirect',
        water: prod.water || 'Moderate',
        environment: prod.environment || 'Indoor',
        difficulty: prod.difficulty || 'Easy',
        stockQuantity: prod.stockQuantity,
        isActive: prod.active !== undefined ? prod.active : true,
        petFriendly: prod.petFriendly || false,
        description: prod.description || '',
      });
    } else {
      setProductForm({
        name: '',
        categorySlug: categories[0]?.slug || 'flowering-plants',
        scientificName: '',
        price: '',
        originalPrice: '',
        image: 'https://inaturalist-open-data.s3.amazonaws.com/photos/212419198/medium.jpeg',
        light: 'Bright Indirect',
        water: 'Moderate',
        environment: 'Indoor',
        difficulty: 'Easy',
        stockQuantity: 50,
        isActive: true,
        petFriendly: false,
        description: '',
      });
    }
    setProductError('');
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setProductError('');
    if (!productForm.name || !productForm.name.trim()) {
      setProductError('Product name is required.');
      return;
    }
    const parsedPrice = parseFloat(productForm.price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setProductError('Price must be greater than 0.');
      return;
    }
    const parsedStock = parseInt(productForm.stockQuantity, 10);
    if (isNaN(parsedStock) || parsedStock < 0) {
      setProductError('Stock quantity cannot be negative.');
      return;
    }
    try {
      const payload = {
        ...productForm,
        name: productForm.name.trim(),
        price: parsedPrice,
        originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : null,
        stockQuantity: parsedStock,
      };

      if (editingProduct) {
        await plantifyApi.updateAdminProduct(editingProduct.id, payload);
      } else {
        await plantifyApi.createAdminProduct(payload);
      }
      setShowProductModal(false);
      loadProducts();
      loadStats();
    } catch (err) {
      setProductError(err.message || 'Failed to save product');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await plantifyApi.updateOrderStatus(orderId, newStatus);
      loadOrders();
      loadStats();
      if (selectedOrder && selectedOrder.id === orderId) {
        const refreshed = await plantifyApi.getOrderById(orderId);
        setSelectedOrder(refreshed);
      }
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchProductQuery.toLowerCase()) ||
    (p.scientificName && p.scientificName.toLowerCase().includes(searchProductQuery.toLowerCase())) ||
    (p.category && p.category.toLowerCase().includes(searchProductQuery.toLowerCase()))
  );

  const filteredOrders = orders.filter(o =>
    orderStatusFilter === 'ALL' || o.orderStatus === orderStatusFilter
  );

  if (!isAdmin) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '2rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
        <h2 style={{ color: 'var(--color-forest)' }}>Access Restricted</h2>
        <p style={{ color: 'var(--color-charcoal-muted)', marginBottom: '1.5rem' }}>
          You must be signed in with an Administrator account to view this panel.
        </p>
        <Button variant="forest" onClick={onNavigateHome}>Back to Homepage</Button>
      </div>
    );
  }

  return (
    <div className="admin-container" style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem', minHeight: '70vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button
            onClick={onNavigateHome}
            style={{ background: 'none', border: 'none', color: 'var(--color-forest)', cursor: 'pointer', padding: 0, fontWeight: 600 }}
          >
            ← Back to Storefront
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-forest)', margin: 0 }}>
              Admin Command Center
            </h1>
            <Badge variant="forest">ADMIN</Badge>
          </div>
        </div>

        {/* Tab switchers */}
        <div style={{ display: 'flex', gap: '0.5rem', background: '#FFFFFF', padding: '0.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
          <button
            onClick={() => setActiveTab('stats')}
            style={{
              padding: '0.5rem 1rem', border: 'none', borderRadius: 'var(--radius-xs)',
              background: activeTab === 'stats' ? 'var(--color-forest)' : 'transparent',
              color: activeTab === 'stats' ? '#FFFFFF' : 'var(--color-charcoal)',
              fontWeight: 600, cursor: 'pointer'
            }}
          >
            📊 Analytics
          </button>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '0.5rem 1rem', border: 'none', borderRadius: 'var(--radius-xs)',
              background: activeTab === 'products' ? 'var(--color-forest)' : 'transparent',
              color: activeTab === 'products' ? '#FFFFFF' : 'var(--color-charcoal)',
              fontWeight: 600, cursor: 'pointer'
            }}
          >
            🪴 Inventory ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '0.5rem 1rem', border: 'none', borderRadius: 'var(--radius-xs)',
              background: activeTab === 'orders' ? 'var(--color-forest)' : 'transparent',
              color: activeTab === 'orders' ? '#FFFFFF' : 'var(--color-charcoal)',
              fontWeight: 600, cursor: 'pointer'
            }}
          >
            📦 Customer Orders ({orders.length})
          </button>
        </div>
      </div>

      {/* 1. STATS TAB */}
      {activeTab === 'stats' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Total Revenue</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-forest)', margin: '0.35rem 0' }}>
                ₹{parseFloat(stats?.totalRevenue || 0).toFixed(2)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#166534' }}>Across all confirmed orders</div>
            </div>

            <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Total Orders</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-forest)', margin: '0.35rem 0' }}>
                {stats?.totalOrders || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)' }}>{stats?.deliveredOrders || 0} delivered</div>
            </div>

            <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Catalog Specimens</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-forest)', margin: '0.35rem 0' }}>
                {stats?.totalProducts || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)' }}>Across 10 categories</div>
            </div>

            <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Low Stock Alert</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: (stats?.lowStockCount > 0 ? '#DC2626' : 'var(--color-forest)'), margin: '0.35rem 0' }}>
                {stats?.lowStockCount || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)' }}>Stock quantity &lt; 10</div>
            </div>

            <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Registered Users</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-forest)', margin: '0.35rem 0' }}>
                {stats?.totalCustomers || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)' }}>Active customer profiles</div>
            </div>
          </div>

          {/* Status Breakdown Bar */}
          <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-forest)', marginTop: 0, marginBottom: '1rem' }}>
              Order Lifecycle Breakdown
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', textAlign: 'center' }}>
              <div style={{ padding: '0.75rem', background: '#FEF3C7', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#92400E' }}>{stats?.pendingOrders || 0}</div>
                <div style={{ fontSize: '0.75rem', color: '#92400E', fontWeight: 600 }}>PENDING</div>
              </div>
              <div style={{ padding: '0.75rem', background: '#DBEAFE', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E40AF' }}>{stats?.confirmedOrders || 0}</div>
                <div style={{ fontSize: '0.75rem', color: '#1E40AF', fontWeight: 600 }}>CONFIRMED</div>
              </div>
              <div style={{ padding: '0.75rem', background: '#E0E7FF', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#3730A3' }}>{stats?.shippedOrders || 0}</div>
                <div style={{ fontSize: '0.75rem', color: '#3730A3', fontWeight: 600 }}>SHIPPED</div>
              </div>
              <div style={{ padding: '0.75rem', background: '#DCFCE7', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#166534' }}>{stats?.deliveredOrders || 0}</div>
                <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>DELIVERED</div>
              </div>
              <div style={{ padding: '0.75rem', background: '#FEE2E2', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#991B1B' }}>{stats?.cancelledOrders || 0}</div>
                <div style={{ fontSize: '0.75rem', color: '#991B1B', fontWeight: 600 }}>CANCELLED</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <input
              type="text"
              placeholder="🔍 Search catalog plants..."
              value={searchProductQuery}
              onChange={(e) => setSearchProductQuery(e.target.value)}
              style={{ padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', width: '280px' }}
            />
            <Button variant="accent" onClick={() => openProductModal()}>
              + Add Botanical Specimen
            </Button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-charcoal-muted)' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Plant</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Category</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Price</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Stock</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden' }}>
                          <PlantImage
                            src={p.image}
                            alt={p.name}
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--color-forest)' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--color-charcoal-muted)' }}>{p.scientificName}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{p.category}</td>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>₹{p.price}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span style={{ color: p.stockQuantity < 10 ? '#DC2626' : 'inherit', fontWeight: p.stockQuantity < 10 ? 700 : 400 }}>
                        {p.stockQuantity} units
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <Badge variant={p.active ? 'forest' : 'outline'}>
                        {p.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                      <button
                        onClick={() => openProductModal(p)}
                        style={{ background: 'none', border: 'none', color: 'var(--color-forest)', fontWeight: 600, cursor: 'pointer', marginRight: '0.75rem' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleProductActive(p.id)}
                        style={{ background: 'none', border: 'none', color: p.active ? '#CC5500' : '#166534', fontWeight: 600, cursor: 'pointer' }}
                      >
                        {p.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. ORDERS TAB */}
      {activeTab === 'orders' && (
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-forest)', margin: 0 }}>
              Store Orders
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Filter Status:</label>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                style={{ padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-charcoal-muted)' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Order #</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Customer</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Date</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Total</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Payment</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Update Status</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: 'var(--color-forest)' }}>
                      {o.orderNumber}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <div>{o.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)' }}>{o.customerEmail}</div>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>
                      ₹{parseFloat(o.totalAmount || 0).toFixed(2)}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <Badge variant={o.paymentStatus === 'PAID' ? 'forest' : 'amber'}>
                        {o.paymentStatus} ({o.paymentMethod})
                      </Badge>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <Badge variant={o.orderStatus === 'DELIVERED' ? 'forest' : o.orderStatus === 'CANCELLED' ? 'amber' : 'sage'}>
                        {o.orderStatus}
                      </Badge>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        disabled={o.orderStatus === 'CANCELLED' || o.orderStatus === 'DELIVERED'}
                        style={{ padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--color-border)', fontSize: '0.8rem' }}
                      >
                        <option value={o.orderStatus}>{o.orderStatus}</option>
                        {o.orderStatus === 'PENDING' && (
                          <>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </>
                        )}
                        {o.orderStatus === 'CONFIRMED' && (
                          <>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </>
                        )}
                        {o.orderStatus === 'PROCESSING' && (
                          <>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </>
                        )}
                        {o.orderStatus === 'SHIPPED' && (
                          <option value="DELIVERED">DELIVERED</option>
                        )}
                      </select>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                      <button
                        onClick={async () => {
                          try {
                            const full = await plantifyApi.getAdminOrderById(o.id);
                            setSelectedOrder(full || o);
                          } catch {
                            setSelectedOrder(o);
                          }
                        }}
                        style={{
                          background: 'none',
                          border: '1px solid var(--color-forest)',
                          color: 'var(--color-forest)',
                          borderRadius: 'var(--radius-xs)',
                          padding: '0.25rem 0.65rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRODUCT CREATE/EDIT MODAL */}
      {showProductModal && (
        <div className="modal-overlay" onClick={() => setShowProductModal(false)} role="dialog" aria-modal="true">
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <button className="modal-close-btn" onClick={() => setShowProductModal(false)}>&times;</button>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-forest)', marginTop: 0 }}>
              {editingProduct ? 'Edit Specimen Details' : 'Add New Botanical Specimen'}
            </h2>

            {productError && (
              <div style={{ background: '#FDF2F2', color: '#991B1B', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {productError}
              </div>
            )}

            <form onSubmit={handleProductSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Plant Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm(p => ({ ...p, name: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Scientific Botanical Name</label>
                  <input
                    type="text"
                    value={productForm.scientificName}
                    onChange={(e) => setProductForm(p => ({ ...p, scientificName: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Category *</label>
                  <select
                    value={productForm.categorySlug}
                    onChange={(e) => setProductForm(p => ({ ...p, categorySlug: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', boxSizing: 'border-box' }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Stock Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={productForm.stockQuantity}
                    onChange={(e) => setProductForm(p => ({ ...p, stockQuantity: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm(p => ({ ...p, price: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Original/MSRP Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm(p => ({ ...p, originalPrice: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Botanical Image URL *</label>
                <input
                  type="url"
                  required
                  value={productForm.image}
                  onChange={(e) => setProductForm(p => ({ ...p, image: e.target.value }))}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Environment</label>
                  <select
                    value={productForm.environment}
                    onChange={(e) => setProductForm(p => ({ ...p, environment: e.target.value }))}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                  >
                    <option value="Indoor">Indoor</option>
                    <option value="Outdoor">Outdoor</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Difficulty</label>
                  <select
                    value={productForm.difficulty}
                    onChange={(e) => setProductForm(p => ({ ...p, difficulty: e.target.value }))}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Pet Friendly</label>
                  <select
                    value={productForm.petFriendly ? 'true' : 'false'}
                    onChange={(e) => setProductForm(p => ({ ...p, petFriendly: e.target.value === 'true' }))}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Description</label>
                <textarea
                  rows="3"
                  value={productForm.description}
                  onChange={(e) => setProductForm(p => ({ ...p, description: e.target.value }))}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', boxSizing: 'border-box' }}
                />
              </div>

              <Button type="submit" variant="accent" style={{ width: '100%' }}>
                {editingProduct ? 'Save Product Changes' : 'Create Product'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)} role="dialog" aria-modal="true">
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <button className="modal-close-btn" onClick={() => setSelectedOrder(null)}>&times;</button>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-forest)', margin: 0 }}>
                  Order {selectedOrder.orderNumber}
                </h2>
                <div style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Badge variant={selectedOrder.orderStatus === 'DELIVERED' ? 'forest' : selectedOrder.orderStatus === 'CANCELLED' ? 'amber' : 'sage'}>
                  {selectedOrder.orderStatus}
                </Badge>
                <Badge variant={selectedOrder.paymentStatus === 'PAID' ? 'forest' : 'amber'}>
                  {selectedOrder.paymentStatus} ({selectedOrder.paymentMethod})
                </Badge>
              </div>
            </div>

            {/* Customer & Delivery Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem', background: '#FBFBF9', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-forest)', fontSize: '0.9rem' }}>👤 Customer Info</h4>
                <div style={{ fontSize: '0.85rem' }}><strong>Name:</strong> {selectedOrder.customerName}</div>
                <div style={{ fontSize: '0.85rem' }}><strong>Email:</strong> {selectedOrder.customerEmail}</div>
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-forest)', fontSize: '0.9rem' }}>📍 Delivery Address (Snapshot)</h4>
                {selectedOrder.deliveryAddress ? (
                  <div style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                    <div><strong>Recipient:</strong> {selectedOrder.deliveryAddress.recipientName} ({selectedOrder.deliveryAddress.phone})</div>
                    <div>{selectedOrder.deliveryAddress.streetAddress}</div>
                    <div>{selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state} - {selectedOrder.deliveryAddress.postalCode}</div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>Standard saved delivery profile</div>
                )}
              </div>
            </div>

            {/* Items Table */}
            <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--color-forest)' }}>🌿 Order Items ({selectedOrder.items?.length || 0})</h4>
            <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#F5F5F0', borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                    <th style={{ padding: '0.6rem 0.75rem' }}>Specimen</th>
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>Price</th>
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((it, idx) => (
                    <tr key={it.id || idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '0.6rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {it.productImage && (
                          <img src={it.productImage} alt={it.productName} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' }} />
                        )}
                        <span style={{ fontWeight: 600 }}>{it.productName}</span>
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>₹{Number(it.unitPrice).toFixed(2)}</td>
                      <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>{it.quantity}</td>
                      <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: 600 }}>₹{Number(it.subtotal).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div style={{ marginLeft: 'auto', width: '240px', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span>Subtotal:</span>
                <span>₹{Number(selectedOrder.subtotal || 0).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Shipping:</span>
                <span>₹{Number(selectedOrder.shippingCharge || 0).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', borderTop: '2px solid var(--color-border)', paddingTop: '0.5rem', color: 'var(--color-forest)' }}>
                <span>Total:</span>
                <span>₹{Number(selectedOrder.totalAmount || 0).toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="secondary" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

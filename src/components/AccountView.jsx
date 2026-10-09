import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import plantifyApi from '../services/plantifyApi';
import Button from './Button';
import Badge from './Badge';
import PlantImage from './PlantImage';
import MyPlants from '../pages/account/MyPlants';

export default function AccountView({ onNavigateHome, onOpenCart, catalogPlants = [], onAskAi, initialTab = 'profile' }) {
  const { user, logout, updateProfile, openLoginModal } = useAuth();

  const [activeTab, setActiveTab] = useState(initialTab || 'profile'); // 'profile' | 'addresses' | 'orders' | 'plants'
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
  });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [profileSaving, setProfileSaving] = useState(false);

  // Addresses
  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressDeletingId, setAddressDeletingId] = useState(null);
  const [settingDefaultId, setSettingDefaultId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    recipientName: '',
    phone: '',
    streetAddress: '',
    landmark: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false,
  });
  const [addressError, setAddressError] = useState('');

  // Orders
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || '',
        phone: user.phone || '',
        currentPassword: '',
        newPassword: '',
      });
      loadAddresses();
      loadOrders();
    }
  }, [user]);

  const loadAddresses = async () => {
    try {
      setAddressLoading(true);
      const data = await plantifyApi.getAddresses();
      setAddresses(data || []);
    } catch (err) {
      console.error('Failed to load addresses:', err);
    } finally {
      setAddressLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const data = await plantifyApi.getMyOrders();
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (profileSaving) return;
    setProfileMsg({ type: '', text: '' });

    if (!profileForm.fullName.trim() || profileForm.fullName.trim().length < 2) {
      setProfileMsg({ type: 'error', text: 'Full name must be at least 2 characters long.' });
      return;
    }

    if (profileForm.phone && profileForm.phone.trim().length > 0) {
      if (!/^[+0-9\s-]{8,20}$/.test(profileForm.phone.trim())) {
        setProfileMsg({ type: 'error', text: 'Please enter a valid phone number (at least 8 digits).' });
        return;
      }
    }

    if (profileForm.newPassword) {
      if (!profileForm.currentPassword) {
        setProfileMsg({ type: 'error', text: 'Current password is required to set a new password.' });
        return;
      }
      if (profileForm.newPassword.length < 6) {
        setProfileMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
        return;
      }
    }

    try {
      setProfileSaving(true);
      await updateProfile({
        fullName: profileForm.fullName.trim(),
        phone: profileForm.phone ? profileForm.phone.trim() : null,
        currentPassword: profileForm.currentPassword || null,
        newPassword: profileForm.newPassword || null,
      });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
      setProfileForm(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setProfileSaving(false);
    }
  };

  const openAddressModal = (addr = null) => {
    setEditingAddress(addr);
    if (addr) {
      setAddressForm({
        recipientName: addr.recipientName,
        phone: addr.phone,
        streetAddress: addr.streetAddress,
        landmark: addr.landmark || '',
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode,
        country: addr.country || 'India',
        isDefault: addr.default || false,
      });
    } else {
      setAddressForm({
        recipientName: user?.fullName || '',
        phone: user?.phone || '',
        streetAddress: '',
        landmark: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        isDefault: addresses.length === 0,
      });
    }
    setAddressError('');
    setShowAddressModal(true);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (addressSaving) return;
    setAddressError('');

    const recipient = addressForm.recipientName.trim();
    const phone = addressForm.phone.trim();
    const street = addressForm.streetAddress.trim();
    const city = addressForm.city.trim();
    const state = addressForm.state.trim();
    const postal = addressForm.postalCode.trim();

    if (!recipient || !phone || !street || !city || !state || !postal) {
      setAddressError('Please fill in all required fields marked with *');
      return;
    }

    if (recipient.length < 2) {
      setAddressError('Recipient name must be at least 2 characters long.');
      return;
    }

    if (!/^[+0-9\s-]{8,25}$/.test(phone)) {
      setAddressError('Please enter a valid phone number with at least 8 digits.');
      return;
    }

    if (!/^[0-9]{5,6}$|^[A-Za-z0-9\s-]{3,10}$/.test(postal)) {
      setAddressError('Please enter a valid postal/PIN code (e.g. 560001).');
      return;
    }

    const payload = {
      ...addressForm,
      recipientName: recipient,
      phone: phone,
      streetAddress: street,
      landmark: addressForm.landmark ? addressForm.landmark.trim() : null,
      city: city,
      state: state,
      postalCode: postal,
      country: addressForm.country ? addressForm.country.trim() : 'India',
    };

    try {
      setAddressSaving(true);
      if (editingAddress) {
        await plantifyApi.updateAddress(editingAddress.id, payload);
      } else {
        await plantifyApi.createAddress(payload);
      }
      setShowAddressModal(false);
      loadAddresses();
    } catch (err) {
      setAddressError(err.message || 'Failed to save address');
    } finally {
      setAddressSaving(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (addressDeletingId) return;
    if (!window.confirm('Are you sure you want to delete this delivery address? Historical order records will be preserved.')) return;
    try {
      setAddressDeletingId(id);
      await plantifyApi.deleteAddress(id);
      loadAddresses();
    } catch (err) {
      alert(err.message || 'Failed to delete address');
    } finally {
      setAddressDeletingId(null);
    }
  };

  const handleSetDefaultAddress = async (id) => {
    if (settingDefaultId) return;
    try {
      setSettingDefaultId(id);
      await plantifyApi.setDefaultAddress(id);
      loadAddresses();
    } catch (err) {
      alert(err.message || 'Failed to set default address');
    } finally {
      setSettingDefaultId(null);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? Stock will be returned to inventory.')) return;
    try {
      setCancellingOrderId(orderId);
      await plantifyApi.cancelOrder(orderId);
      loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        const refreshed = await plantifyApi.getOrderById(orderId);
        setSelectedOrder(refreshed);
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'DELIVERED': return 'forest';
      case 'SHIPPED':
      case 'PROCESSING': return 'sage';
      case 'CONFIRMED':
      case 'PENDING': return 'outline';
      case 'CANCELLED': return 'amber';
      default: return 'outline';
    }
  };

  if (!user) {
    return (
      <div className="account-container" style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '2.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
            Sign In Required
          </h2>
          <p style={{ color: 'var(--color-charcoal-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Please log in or create an account to view your profile, manage saved delivery addresses, and track your plant orders.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Button variant="forest" onClick={openLoginModal}>Sign In / Register</Button>
            <Button variant="outline" onClick={onNavigateHome}>Back to Store</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-container" style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1.5rem', minHeight: '65vh' }}>
      {/* Breadcrumb header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <button
            onClick={onNavigateHome}
            style={{ background: 'none', border: 'none', color: 'var(--color-forest)', cursor: 'pointer', padding: 0, fontWeight: 600 }}
          >
            ← Back to Store
          </button>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-forest)', margin: '0.5rem 0 0 0' }}>
            My Account
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700, color: 'var(--color-forest)' }}>{user?.fullName}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>{user?.email}</div>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>Sign Out</Button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="account-tabs-grid" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem' }}>
        {/* Navigation Sidebar */}
        <aside style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1rem', height: 'fit-content' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)',
                background: activeTab === 'profile' ? 'var(--color-amber-pale)' : 'transparent',
                color: activeTab === 'profile' ? 'var(--color-amber-text)' : 'var(--color-charcoal)',
                fontWeight: activeTab === 'profile' ? 700 : 500,
                border: 'none',
                borderLeft: activeTab === 'profile' ? '4px solid var(--color-amber)' : '4px solid transparent',
                cursor: 'pointer', textAlign: 'left', width: '100%'
              }}
            >
              <span>👤</span> Profile Details
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)',
                background: activeTab === 'addresses' ? 'var(--color-amber-pale)' : 'transparent',
                color: activeTab === 'addresses' ? 'var(--color-amber-text)' : 'var(--color-charcoal)',
                fontWeight: activeTab === 'addresses' ? 700 : 500,
                border: 'none',
                borderLeft: activeTab === 'addresses' ? '4px solid var(--color-amber)' : '4px solid transparent',
                cursor: 'pointer', textAlign: 'left', width: '100%'
              }}
            >
              <span>📍</span> Saved Addresses ({addresses.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)',
                background: activeTab === 'orders' ? 'var(--color-amber-pale)' : 'transparent',
                color: activeTab === 'orders' ? 'var(--color-amber-text)' : 'var(--color-charcoal)',
                fontWeight: activeTab === 'orders' ? 700 : 500,
                border: 'none',
                borderLeft: activeTab === 'orders' ? '4px solid var(--color-amber)' : '4px solid transparent',
                cursor: 'pointer', textAlign: 'left', width: '100%'
              }}
            >
              <span>📦</span> Order History ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('plants')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)',
                background: activeTab === 'plants' ? 'var(--color-amber-pale)' : 'transparent',
                color: activeTab === 'plants' ? 'var(--color-amber-text)' : 'var(--color-charcoal)',
                fontWeight: activeTab === 'plants' ? 700 : 500,
                border: 'none',
                borderLeft: activeTab === 'plants' ? '4px solid var(--color-amber)' : '4px solid transparent',
                cursor: 'pointer', textAlign: 'left', width: '100%'
              }}
            >
              <span>🌿</span> My Plants & Care
            </button>
          </nav>
        </aside>

        {/* Tab Content Panel */}
        <main style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '2rem' }}>
          {/* 1. PROFILE TAB */}
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-forest)', marginTop: 0, marginBottom: '1.5rem' }}>
                Profile & Security
              </h2>

              {profileMsg.text && (
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '1.5rem',
                  background: profileMsg.type === 'success' ? '#F0FDF4' : '#FDF2F2',
                  color: profileMsg.type === 'success' ? '#166534' : '#991B1B',
                  border: `1px solid ${profileMsg.type === 'success' ? '#86EFAC' : '#FCA5A5'}`
                }}>
                  {profileMsg.text}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} style={{ maxWidth: '520px' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '0.35rem' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm(p => ({ ...p, fullName: e.target.value }))}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '0.35rem' }}>
                    Email Address (Immutable)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-off-white)', color: '#666' }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '0.35rem' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', color: 'var(--color-forest)', marginTop: 0, marginBottom: '0.75rem' }}>
                    Change Password (Optional)
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '0.35rem' }}>
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={profileForm.currentPassword}
                        onChange={(e) => setProfileForm(p => ({ ...p, currentPassword: e.target.value }))}
                        placeholder="••••••••"
                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '0.35rem' }}>
                        New Password
                      </label>
                      <input
                        type="password"
                        value={profileForm.newPassword}
                        onChange={(e) => setProfileForm(p => ({ ...p, newPassword: e.target.value }))}
                        placeholder="At least 6 chars"
                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" variant="accent" disabled={profileSaving}>
                  {profileSaving ? 'Saving Changes...' : 'Save Profile Changes'}
                </Button>
              </form>
            </div>
          )}

          {/* 2. ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-forest)', margin: 0 }}>
                  Delivery Addresses
                </h2>
                <Button variant="accent" size="sm" onClick={() => openAddressModal()}>
                  + Add New Address
                </Button>
              </div>

              {addressLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading addresses...</div>
              ) : addresses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📍</div>
                  <h3 style={{ margin: 0, color: 'var(--color-forest)' }}>No saved addresses yet</h3>
                  <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    Save your delivery address for fast checkout.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => openAddressModal()}>Add Address</Button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      style={{
                        border: addr.default ? '2px solid var(--color-forest)' : '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem',
                        position: 'relative',
                        background: addr.default ? '#F9FAF8' : '#FFFFFF'
                      }}
                    >
                      {addr.default && (
                        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                          <Badge variant="forest">Default</Badge>
                        </div>
                      )}
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-forest)', marginBottom: '0.25rem' }}>
                        {addr.recipientName}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-charcoal)', lineHeight: 1.4, marginBottom: '0.5rem' }}>
                        {addr.streetAddress}
                        {addr.landmark ? `, ${addr.landmark}` : ''}<br />
                        {addr.city}, {addr.state} - {addr.postalCode}<br />
                        {addr.country}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)', marginBottom: '1rem' }}>
                        📞 {addr.phone}
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                        <button
                          onClick={() => openAddressModal(addr)}
                          style={{ background: 'none', border: 'none', color: 'var(--color-forest)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                        >
                          Edit
                        </button>
                        <span style={{ color: 'var(--color-border)' }}>|</span>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          disabled={addressDeletingId === addr.id}
                          style={{ background: 'none', border: 'none', color: '#DC2626', fontSize: '0.8rem', fontWeight: 600, cursor: addressDeletingId === addr.id ? 'not-allowed' : 'pointer', padding: 0 }}
                        >
                          {addressDeletingId === addr.id ? 'Deleting...' : 'Delete'}
                        </button>
                        {!addr.default && (
                          <>
                            <span style={{ color: 'var(--color-border)' }}>|</span>
                            <button
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              disabled={settingDefaultId === addr.id}
                              style={{ background: 'none', border: 'none', color: 'var(--color-charcoal-muted)', fontSize: '0.8rem', fontWeight: 600, cursor: settingDefaultId === addr.id ? 'not-allowed' : 'pointer', padding: 0 }}
                            >
                              {settingDefaultId === addr.id ? 'Setting...' : 'Set as Default'}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. ORDERS TAB */}
          {activeTab === 'orders' && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-forest)', marginTop: 0, marginBottom: '1.5rem' }}>
                Order History
              </h2>

              {ordersLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading your orders...</div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
                  <h3 style={{ margin: 0, color: 'var(--color-forest)' }}>No orders placed yet</h3>
                  <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    Discover our verified botanical collections and grow your indoor jungle.
                  </p>
                  <Button variant="forest" size="sm" onClick={onNavigateHome}>Start Shopping</Button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      style={{
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem',
                        background: '#FFFFFF'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                        <div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>
                            ORDER #{order.orderNumber} • {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-forest)', marginTop: '0.2rem' }}>
                            ₹{order.totalAmount}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Badge variant={getStatusBadgeVariant(order.orderStatus)}>
                            {order.orderStatus}
                          </Badge>
                          <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                            View Details
                          </Button>
                        </div>
                      </div>

                      {/* Items previews */}
                      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        {order.items?.map((item) => (
                          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-off-white)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                            <div style={{ width: '40px', height: '40px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden' }}>
                              <PlantImage
                                src={item.productImage}
                                alt={item.productName}
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                              />
                            </div>
                            <div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-forest)' }}>{item.productName}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)' }}>Qty: {item.quantity} × ₹{item.unitPrice}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Action Footer */}
                      {(order.orderStatus === 'PENDING' || order.orderStatus === 'CONFIRMED') && (
                        <div style={{ marginTop: '0.75rem', textAlign: 'right' }}>
                          <Button
                            variant="amber"
                            size="sm"
                            disabled={cancellingOrderId === order.id}
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel Order'}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. MY PLANTS TAB */}
          {activeTab === 'plants' && (
            <MyPlants
              catalogPlants={catalogPlants}
              onNavigateCatalog={onNavigateHome}
              onAskAi={onAskAi}
            />
          )}
        </main>
      </div>

      {/* ADDRESS MODAL */}
      {showAddressModal && (
        <div className="modal-overlay" onClick={() => setShowAddressModal(false)} role="dialog" aria-modal="true">
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', padding: '2rem' }}>
            <button className="modal-close-btn" onClick={() => setShowAddressModal(false)}>&times;</button>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-forest)', marginTop: 0 }}>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>

            {addressError && (
              <div style={{ background: '#FDF2F2', color: '#991B1B', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {addressError}
              </div>
            )}

            <form onSubmit={handleAddressSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Recipient Name *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.recipientName}
                    onChange={(e) => setAddressForm(a => ({ ...a, recipientName: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm(a => ({ ...a, phone: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Street Address *</label>
                <input
                  type="text"
                  required
                  value={addressForm.streetAddress}
                  onChange={(e) => setAddressForm(a => ({ ...a, streetAddress: e.target.value }))}
                  placeholder="House/Flat number, building name, street"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Landmark (Optional)</label>
                <input
                  type="text"
                  value={addressForm.landmark}
                  onChange={(e) => setAddressForm(a => ({ ...a, landmark: e.target.value }))}
                  placeholder="Near City Park, opposite metro station"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>City *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm(a => ({ ...a, city: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>State *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) => setAddressForm(a => ({ ...a, state: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Postal Code *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm(a => ({ ...a, postalCode: e.target.value }))}
                    placeholder="e.g. 110001"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Country</label>
                  <input
                    type="text"
                    value={addressForm.country}
                    onChange={(e) => setAddressForm(a => ({ ...a, country: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="defaultAddressCheck"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm(a => ({ ...a, isDefault: e.target.checked }))}
                />
                <label htmlFor="defaultAddressCheck" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                  Make this my default shipping address
                </label>
              </div>

              <Button type="submit" variant="accent" disabled={addressSaving} style={{ width: '100%' }}>
                {addressSaving ? 'Saving Address...' : (editingAddress ? 'Update Address' : 'Save Address')}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)} role="dialog" aria-modal="true">
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', padding: '2rem' }}>
            <button className="modal-close-btn" onClick={() => setSelectedOrder(null)}>&times;</button>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-forest)', margin: 0 }}>
                Order #{selectedOrder.orderNumber}
              </h2>
              <Badge variant={getStatusBadgeVariant(selectedOrder.orderStatus)}>
                {selectedOrder.orderStatus}
              </Badge>
            </div>

            <div style={{ background: 'var(--color-off-white)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div><strong>Delivery Address:</strong> {selectedOrder.deliveryAddressSnapshot}</div>
              <div style={{ marginTop: '0.5rem' }}><strong>Payment:</strong> {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})</div>
              {selectedOrder.notes && <div style={{ marginTop: '0.25rem' }}><strong>Notes:</strong> {selectedOrder.notes}</div>}
            </div>

            <h3 style={{ fontSize: '1rem', color: 'var(--color-forest)', marginBottom: '0.75rem' }}>Items Ordered</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '220px', overflowY: 'auto', marginBottom: '1.25rem' }}>
              {selectedOrder.items?.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '45px', height: '45px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden' }}>
                      <PlantImage
                        src={item.productImage}
                        alt={item.productName}
                        style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                      />
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
                <span>₹{selectedOrder.subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Shipping:</span>
                <span>{selectedOrder.shippingCharge > 0 ? `₹${selectedOrder.shippingCharge}` : 'Free'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-forest)' }}>
                <span>Total:</span>
                <span>₹{selectedOrder.totalAmount}</span>
              </div>
            </div>

            {(selectedOrder.orderStatus === 'PENDING' || selectedOrder.orderStatus === 'CONFIRMED') && (
              <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                <Button
                  variant="amber"
                  size="sm"
                  disabled={cancellingOrderId === selectedOrder.id}
                  onClick={() => handleCancelOrder(selectedOrder.id)}
                >
                  {cancellingOrderId === selectedOrder.id ? 'Cancelling...' : 'Cancel Order'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

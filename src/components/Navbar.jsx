import React, { useState } from 'react';
import Logo from '../assets/Logo.jsx';
import { useAuth } from '../context/AuthContext';

/**
 * Reusable Plantify Navbar Component.
 * Features brand logo, desktop navigation, action buttons (search, wishlist, cart, account),
 * authenticated user dropdown, and responsive mobile drawer.
 */
export default function Navbar({
  cartCount = 0,
  wishlistCount = 0,
  activeNav = 'home',
  onSearchSubmit,
  onOpenWishlist,
  onOpenCart,
  onNavigate,
}) {
  const { user, isAuthenticated, isAdmin, openLoginModal, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#/', id: 'home' },
    { label: 'Plants', href: '#plants', id: 'plants' },
    { label: 'AI Assistant', href: '#ai-assistant', id: 'ai-assistant' },
    { label: 'My Plants', href: '#/my-plants', id: 'my-plants' },
    { label: 'For Farmers', href: '#for-farmers', id: 'for-farmers' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleLinkClick = (link, e) => {
    setIsMobileMenuOpen(false);
    if (link.id === 'my-plants') {
      e.preventDefault();
      if (!isAuthenticated) {
        openLoginModal();
      } else if (onNavigate) {
        onNavigate('my-plants');
      }
      return;
    }
    if (onNavigate) {
      if (link.id === 'home') {
        e.preventDefault();
        onNavigate('catalog');
        window.location.hash = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        e.preventDefault();
        onNavigate(link.id);
      }
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery);
    }
    setIsSearchOpen(false);
  };

  const handleAccountClick = () => {
    if (!isAuthenticated) {
      openLoginModal();
    } else {
      setUserMenuOpen(!userMenuOpen);
    }
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <div className="container navbar-container">
        
        {/* Brand Logo */}
        <a
          href="#/"
          style={{ textDecoration: 'none' }}
          aria-label="Plantify Homepage"
          onClick={(e) => {
            if (onNavigate) {
              e.preventDefault();
              onNavigate('catalog');
            }
          }}
        >
          <Logo size="md" showTagline={true} />
        </a>

        {/* Desktop Navigation Links */}
        <ul className="nav-links-desktop">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                className={activeNav === link.id ? 'active' : ''}
                onClick={(e) => handleLinkClick(link, e)}
              >
                {link.label}
              </a>
            </li>
          ))}
          {isAdmin && (
            <li>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('admin')}
                style={{
                  background: '#FEF3C7',
                  color: '#92400E',
                  border: '1px solid #FCD34D',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                ⚡ ADMIN
              </button>
            </li>
          )}
        </ul>

        {/* Action Controls */}
        <div className="nav-actions">
          
          {/* Search Toggle Icon */}
          <button
            type="button"
            className="icon-btn"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Toggle plant search bar"
            title="Search Plants"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Wishlist Icon with count */}
          <button
            type="button"
            className="icon-btn wishlist-btn"
            onClick={onOpenWishlist}
            aria-label={`Wishlist, ${wishlistCount} saved plants`}
            title="View Wishlist"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlistCount > 0 && <span className="icon-badge">{wishlistCount}</span>}
          </button>

          {/* Cart Icon with count */}
          <button
            type="button"
            className="icon-btn cart-btn"
            onClick={onOpenCart}
            aria-label={`Shopping Cart, ${cartCount} items added`}
            title="View Shopping Cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && <span className="icon-badge">{cartCount}</span>}
          </button>

          {/* User Account Button & Dropdown */}
          <div style={{ position: 'relative' }}>
            {isAuthenticated ? (
              <button
                type="button"
                className="icon-btn"
                onClick={handleAccountClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
                title={`Signed in as ${user?.fullName}`}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--color-forest)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>
                  {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
              </button>
            ) : (
              <button
                type="button"
                className="icon-btn"
                aria-label="Sign In"
                onClick={handleAccountClick}
                title="Sign In / Register"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
            )}

            {/* Dropdown Menu */}
            {userMenuOpen && isAuthenticated && (
              <div
                style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  width: '220px',
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  border: '1px solid var(--color-border)',
                  padding: '0.75rem 0',
                  zIndex: 1000
                }}
              >
                <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-forest)' }}>{user?.fullName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
                </div>

                <div style={{ padding: '0.25rem 0' }}>
                  <button
                    onClick={() => { setUserMenuOpen(false); onNavigate && onNavigate('account'); }}
                    style={{
                      width: '100%', textAlign: 'left', padding: '0.5rem 1rem',
                      background: 'none', border: 'none', fontSize: '0.85rem',
                      cursor: 'pointer', color: 'var(--color-charcoal)'
                    }}
                  >
                    👤 My Account & Profile
                  </button>
                  <button
                    onClick={() => { setUserMenuOpen(false); onNavigate && onNavigate('my-plants'); }}
                    style={{
                      width: '100%', textAlign: 'left', padding: '0.5rem 1rem',
                      background: 'none', border: 'none', fontSize: '0.85rem',
                      cursor: 'pointer', color: 'var(--color-charcoal)'
                    }}
                  >
                    🌿 My Plants &amp; Care
                  </button>
                  <button
                    onClick={() => { setUserMenuOpen(false); onNavigate && onNavigate('account'); }}
                    style={{
                      width: '100%', textAlign: 'left', padding: '0.5rem 1rem',
                      background: 'none', border: 'none', fontSize: '0.85rem',
                      cursor: 'pointer', color: 'var(--color-charcoal)'
                    }}
                  >
                    📦 My Orders
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => { setUserMenuOpen(false); onNavigate && onNavigate('admin'); }}
                      style={{
                        width: '100%', textAlign: 'left', padding: '0.5rem 1rem',
                        background: 'none', border: 'none', fontSize: '0.85rem',
                        cursor: 'pointer', color: '#92400E', fontWeight: 600
                      }}
                    >
                      ⚡ Admin Dashboard
                    </button>
                  )}
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.25rem' }}>
                  <button
                    onClick={() => { setUserMenuOpen(false); logout(); }}
                    style={{
                      width: '100%', textAlign: 'left', padding: '0.5rem 1rem',
                      background: 'none', border: 'none', fontSize: '0.85rem',
                      cursor: 'pointer', color: '#DC2626', fontWeight: 600
                    }}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>

        </div>
      </div>

      {/* Expandable Search Bar Drawer */}
      {isSearchOpen && (
        <div style={{
          backgroundColor: 'var(--color-white)',
          borderBottom: '1px solid var(--color-concrete-light)',
          padding: 'var(--space-md) 0',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <form
            className="container"
            onSubmit={handleSearchSubmit}
            style={{ display: 'flex', gap: 'var(--space-sm)' }}
          >
            <input
              type="text"
              placeholder="Search botanical plants by common or scientific name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '0.6rem 1.2rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-concrete-light)',
                fontSize: 'var(--text-sm)',
                outline: 'none',
              }}
              autoFocus
            />
            <button
              type="submit"
              className="btn btn--primary btn--sm"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Accessible Responsive Mobile Drawer */}
      <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', padding: 0 }}>
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                className={activeNav === link.id ? 'active' : ''}
                onClick={(e) => handleLinkClick(link, e)}
              >
                {link.label}
              </a>
            </li>
          ))}
          {isAuthenticated ? (
            <>
              <li>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); onNavigate && onNavigate('account'); }}
                  style={{ background: 'none', border: 'none', color: 'var(--color-forest)', fontWeight: 700, padding: 0, cursor: 'pointer' }}
                >
                  👤 My Account ({user?.fullName})
                </button>
              </li>
              {isAdmin && (
                <li>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); onNavigate && onNavigate('admin'); }}
                    style={{ background: 'none', border: 'none', color: '#92400E', fontWeight: 700, padding: 0, cursor: 'pointer' }}
                  >
                    ⚡ Admin Dashboard
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); logout(); }}
                  style={{ background: 'none', border: 'none', color: '#DC2626', fontWeight: 700, padding: 0, cursor: 'pointer' }}
                >
                  🚪 Sign Out
                </button>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={() => { setIsMobileMenuOpen(false); openLoginModal(); }}
                style={{ background: 'none', border: 'none', color: 'var(--color-forest)', fontWeight: 700, padding: 0, cursor: 'pointer' }}
              >
                🔐 Sign In / Register
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

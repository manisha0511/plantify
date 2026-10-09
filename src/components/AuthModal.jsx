import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

export default function AuthModal() {
  const { authModalOpen, authModalTab, setAuthModalTab, closeAuthModal, login, register } = useAuth();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Status & error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!authModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setSuccess('');

    if (!loginEmail || !loginPassword) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(loginEmail, loginPassword);
      setLoginEmail('');
      setLoginPassword('');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setSuccess('');

    if (!fullName.trim() || !regEmail.trim() || !regPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (regPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!termsAccepted) {
      setError('You must accept the terms and conditions.');
      return;
    }

    try {
      setLoading(true);
      await register({
        fullName: fullName.trim(),
        email: regEmail.trim(),
        phone: phone.trim() || null,
        password: regPassword,
        termsAccepted,
      });
      setSuccess('Account created successfully!');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal} role="dialog" aria-modal="true">
      <div
        className="modal-dialog auth-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px', padding: '2rem' }}
      >
        <button
          className="modal-close-btn"
          onClick={closeAuthModal}
          aria-label="Close dialog"
        >
          &times;
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🌿</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-forest)', margin: 0 }}>
            {authModalTab === 'login' ? 'Welcome Back' : 'Join Plantify'}
          </h2>
          <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {authModalTab === 'login'
              ? 'Sign in to access your saved plants, cart, and orders'
              : 'Create your account to start your botanical shopping journey'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => { setAuthModalTab('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'none',
              border: 'none',
              borderBottom: authModalTab === 'login' ? '2px solid var(--color-amber)' : '2px solid transparent',
              fontWeight: authModalTab === 'login' ? 700 : 500,
              color: authModalTab === 'login' ? 'var(--color-amber-text)' : 'var(--color-charcoal-muted)',
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthModalTab('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'none',
              border: 'none',
              borderBottom: authModalTab === 'register' ? '2px solid var(--color-amber)' : '2px solid transparent',
              fontWeight: authModalTab === 'register' ? 700 : 500,
              color: authModalTab === 'register' ? 'var(--color-amber-text)' : 'var(--color-charcoal-muted)',
              cursor: 'pointer',
            }}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div style={{
            background: '#FDF2F2',
            color: '#991B1B',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            marginBottom: '1rem',
            border: '1px solid #FCA5A5'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: '#F0FDF4',
            color: '#166534',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            marginBottom: '1rem',
            border: '1px solid #86EFAC'
          }}>
            {success}
          </div>
        )}

        {authModalTab === 'login' ? (
          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '0.35rem' }}>
                Email Address *
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="name@example.com"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '0.35rem' }}>
                Password *
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <Button
              type="submit"
              variant="accent"
              disabled={loading}
              style={{ width: '100%', padding: '0.85rem' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setAuthModalTab('register'); setError(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--color-amber)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                Sign up here
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '0.35rem' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '0.35rem' }}>
                Email Address *
              </label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="jane@example.com"
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '0.35rem' }}>
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '0.35rem' }}>
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 6 chars"
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '0.35rem' }}>
                  Confirm *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <label htmlFor="terms" style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)', cursor: 'pointer' }}>
                I agree to Plantify's Terms of Service and Privacy Policy
              </label>
            </div>

            <Button
              type="submit"
              variant="accent"
              disabled={loading}
              style={{ width: '100%', padding: '0.85rem' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setAuthModalTab('login'); setError(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--color-amber)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                Sign in
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

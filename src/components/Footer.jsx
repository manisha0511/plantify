import React, { useState } from 'react';
import Logo from '../assets/Logo.jsx';
import Button from './Button.jsx';

/**
 * Reusable Footer Component for Plantify.
 * Includes brand identity, catalog links, AI care links, customer care,
 * newsletter subscription, and botanical advisory notice.
 */
export default function Footer({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleLink = (targetId, e) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(targetId);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        
        {/* Main Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-2xl)',
          marginBottom: 'var(--space-3xl)',
        }}>
          
          {/* Column 1: Brand & Philosophy */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <Logo size="md" showTagline={true} />
            </div>
            <p style={{ color: '#BAC7BE', fontSize: 'var(--text-sm)', lineHeight: 1.6, marginBottom: 'var(--space-md)' }}>
              Cultivating living botanical spaces backed by artificial intelligence. Every specimen is nursery-inspected and backed by our 30-day thrive guarantee.
            </p>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-sage-soft)', fontWeight: 600 }}>
              🌿 Nursery Hub • Certified Disease-Free
            </div>
          </div>

          {/* Column 2: Botanical Catalog */}
          <div>
            <h4 style={{ color: 'var(--color-white)', fontSize: 'var(--text-base)', marginBottom: 'var(--space-md)' }}>
              Explore Plants
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><a href="#plants" style={{ color: '#BAC7BE', fontSize: 'var(--text-sm)' }}>Indoor Air Purifiers</a></li>
              <li><a href="#plants" style={{ color: '#BAC7BE', fontSize: 'var="#text-sm"' }}>Low-Light Sanctuaries</a></li>
              <li><a href="#plants" style={{ color: '#BAC7BE', fontSize: 'var(--text-sm)' }}>Rare &amp; Variegated</a></li>
              <li><a href="#plants" style={{ color: '#BAC7BE', fontSize: 'var(--text-sm)' }}>Pet-Friendly Species</a></li>
              <li><a href="#plants" style={{ color: '#BAC7BE', fontSize: 'var(--text-sm)' }}>Drought-Hardy Succulents</a></li>
            </ul>
          </div>

          {/* Column 3: AI Intelligence & Care */}
          <div>
            <h4 style={{ color: 'var(--color-white)', fontSize: 'var(--text-base)', marginBottom: 'var(--space-md)' }}>
              AI &amp; Plant Care
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><a href="#ai-assistant" onClick={(e) => handleLink('ai-assistant', e)} style={{ color: '#BAC7BE', fontSize: 'var(--text-sm)' }}>AI Leaf Diagnosis</a></li>
              <li><a href="#ai-assistant" onClick={(e) => handleLink('ai-assistant', e)} style={{ color: '#BAC7BE', fontSize: 'var(--text-sm)' }}>Smart Watering Calendars</a></li>
              <li><a href="#for-farmers" onClick={(e) => handleLink('for-farmers', e)} style={{ color: '#BAC7BE', fontSize: 'var(--text-sm)' }}>For Farmers &amp; Commercial</a></li>
              <li><a href="#about" onClick={(e) => handleLink('about', e)} style={{ color: '#BAC7BE', fontSize: 'var(--text-sm)' }}>Care Guides Library</a></li>
              <li><a href="#contact" onClick={(e) => handleLink('contact', e)} style={{ color: '#BAC7BE', fontSize: 'var(--text-sm)' }}>Consult a Master Botanist</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Community */}
          <div>
            <h4 style={{ color: 'var(--color-white)', fontSize: 'var(--text-base)', marginBottom: 'var(--space-md)' }}>
              Greener Living Dispatch
            </h4>
            <p style={{ color: '#BAC7BE', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-md)' }}>
              Weekly botanical wisdom, seasonal care reminders, and exclusive first-access to rare specimen drops.
            </p>

            {isSubscribed ? (
              <div style={{
                backgroundColor: 'rgba(156, 175, 136, 0.15)',
                color: 'var(--color-sage-soft)',
                padding: 'var(--space-sm) var(--space-md)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                border: '1px solid var(--color-sage-soft)',
              }}>
                ✓ Thank you for subscribing to Plantify!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    padding: '0.65rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid #2A564A',
                    backgroundColor: '#1C3D34',
                    color: '#FFFFFF',
                    fontSize: 'var(--text-sm)',
                  }}
                />
                <Button variant="accent" size="sm" type="submit">
                  Join the Green Circle
                </Button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar: Copyright & Advisory Disclaimer */}
        <div style={{
          borderTop: '1px solid #23493E',
          paddingTop: 'var(--space-lg)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-md)',
          fontSize: 'var(--text-xs)',
          color: '#8D9E95',
        }}>
          <div>
            © 2026 Plantify Inc. All rights reserved. • Greener Tomorrow
          </div>
          <div style={{ maxWidth: '580px', lineHeight: 1.5, textAlign: 'right' }}>
            Disclaimer: AI Plant Assistant analysis is an educational advisory tool. For commercial disease outbreaks or agricultural health, consult a certified local horticultural extension.
          </div>
        </div>

      </div>
    </footer>
  );
}

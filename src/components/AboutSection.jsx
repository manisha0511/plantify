import React from 'react';
import Badge from './Badge.jsx';
import Button from './Button.jsx';

/**
 * AboutSection Component.
 * Explains Plantify's mission ("Greener Tomorrow"), current live capabilities,
 * full-stack architecture, and verified status of our botanical discovery engine and AI roadmap.
 */
export default function AboutSection({ onNavigateToCatalog }) {
  const capabilities = [
    {
      title: 'Curated 100-Specimen Catalog',
      icon: '🌿',
      tag: 'Live in Production',
      description: 'Ten specialized categories spanning Flowering, Leafy, Indoor, Outdoor, Succulents, Cactus, Herbs, Fruit, Hanging, and Rare Bonsai specimens. Every entry is audited for correct botanical taxonomy and authentic imagery.'
    },
    {
      title: 'Botanical Discovery & Open Data',
      icon: '🔍',
      tag: 'iNaturalist Integration',
      description: 'Connected with international botanical archives to provide verified scientific nomenclature, natural habitat insights, and evidence-based care specifications including precise sunlight, water, and pet-safety metrics.'
    },
    {
      title: 'Full-Stack E-Commerce Engine',
      icon: '⚡',
      tag: 'Spring Boot 3 + MySQL 8',
      description: 'Enterprise backend architecture featuring BCrypt password hashing, stateless JWT authentication, server-validated pricing, transactional inventory management, saved delivery addresses, and real-time order history tracking.'
    },
    {
      title: 'AI Diagnostic Assistant',
      icon: '🔬',
      tag: 'Educational Preview',
      description: 'Currently operates as an interactive educational diagnostic preview with curated symptom guides and phytosanitary disclaimers. Deep-learning multimodal leaf pathology classification is actively in development for future phases.'
    }
  ];

  return (
    <section
      id="about"
      style={{
        padding: 'var(--space-3xl) 0',
        backgroundColor: 'var(--color-white)',
        borderBottom: '1px solid var(--color-concrete-light)',
      }}
    >
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto var(--space-3xl) auto' }}>
          <Badge variant="amber" style={{ marginBottom: 'var(--space-md)' }}>
            🌱 About Plantify
          </Badge>
          
          <h2 style={{
            fontSize: 'var(--text-3xl)',
            fontFamily: 'var(--font-serif)',
            color: 'var(--color-forest)',
            marginBottom: 'var(--space-md)',
            lineHeight: 1.25,
          }}>
            Rooted in Botanical Science. Dedicated to a Greener Tomorrow.
          </h2>
          
          <p style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-charcoal-muted)',
            lineHeight: 1.6,
          }}>
            Plantify was created to eliminate guesswork from plant parenthood. We unite rigorous botanical taxonomy with modern full-stack web engineering, making specimen discovery and plant care intuitive, transparent, and rewarding.
          </p>
        </div>

        {/* 4 Capability Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'var(--space-xl)',
          marginBottom: 'var(--space-3xl)',
        }}>
          {capabilities.map((cap, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--color-off-white)',
                padding: 'var(--space-xl)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-concrete-light)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                <span style={{ fontSize: '2rem' }}>{cap.icon}</span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--color-forest)',
                  backgroundColor: 'var(--color-sage-pale)',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  border: '1px solid var(--color-sage-soft)',
                }}>
                  {cap.tag}
                </span>
              </div>

              <h3 style={{
                fontSize: 'var(--text-lg)',
                fontFamily: 'var(--font-serif)',
                color: 'var(--color-forest)',
                marginBottom: 'var(--space-xs)',
              }}>
                {cap.title}
              </h3>

              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-charcoal-muted)',
                lineHeight: 1.55,
                margin: 0,
              }}>
                {cap.description}
              </p>
            </div>
          ))}
        </div>

        {/* Brand Principles / Mission Block */}
        <div style={{
          backgroundColor: 'var(--color-forest)',
          color: 'var(--color-white)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-2xl) var(--space-xl)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-2xl)',
          alignItems: 'center',
        }}>
          <div>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--text-2xl)',
              color: 'var(--color-white)',
              marginBottom: 'var(--space-sm)',
            }}>
              Our Horticultural Standards
            </h3>
            <p style={{ color: '#D5DFD9', fontSize: 'var(--text-sm)', lineHeight: 1.6, marginBottom: 'var(--space-lg)' }}>
              Every specimen listed on Plantify is inspected for phytosanitary health, acclimatized in regional nursery conditions, and photographed with authentic botanical fidelity.
            </p>
            <Button
              variant="accent"
              size="md"
              onClick={onNavigateToCatalog}
            >
              Explore the Verified Collection →
            </Button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-md)',
          }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: 'var(--space-md)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-sage-soft)', fontFamily: 'var(--font-serif)' }}>100</div>
              <div style={{ fontSize: 'var(--text-xs)', color: '#CBD5D0', marginTop: '4px' }}>Audited Botanical Specimens</div>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: 'var(--space-md)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-sage-soft)', fontFamily: 'var(--font-serif)' }}>10</div>
              <div style={{ fontSize: 'var(--text-xs)', color: '#CBD5D0', marginTop: '4px' }}>Specialized Shopping Categories</div>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: 'var(--space-md)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-sage-soft)', fontFamily: 'var(--font-serif)' }}>100%</div>
              <div style={{ fontSize: 'var(--text-xs)', color: '#CBD5D0', marginTop: '4px' }}>Botanical Specimen Match</div>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: 'var(--space-md)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-sage-soft)', fontFamily: 'var(--font-serif)' }}>24-48h</div>
              <div style={{ fontSize: 'var(--text-xs)', color: '#CBD5D0', marginTop: '4px' }}>Eco-Crate Nursery Dispatch</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

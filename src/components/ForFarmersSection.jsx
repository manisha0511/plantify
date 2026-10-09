import React from 'react';
import Badge from './Badge.jsx';
import Button from './Button.jsx';

/**
 * ForFarmersSection Component.
 * Dedicated section for commercial growers, greenhouse operators, and container farmers.
 * Focuses on practical cultivation data, soil biology, pest management, and bulk inquiry.
 */
export default function ForFarmersSection({ onNavigateToCatalog, onNavigateToContact }) {
  const cultivationGuides = [
    {
      title: 'Climate-Adapted Cultivar Selection',
      icon: '🌱',
      description: 'Selecting drought-hardy, high-yield container cultivars tailored for fluctuating microclimates and urban rooftop or greenhouse beds.',
      points: [
        'Root-ball aeration thresholds and container volume ratios',
        'Seasonal photoperiod requirements & supplemental lux benchmarks',
        'Heat-stress mitigating species for open polyhouse cultivation'
      ]
    },
    {
      title: 'Biological Soil & Moisture Management',
      icon: '💧',
      description: 'Maximizing water-use efficiency through capillary action, perlite-coir aeration balances, and beneficial mycorrhizal root inoculation.',
      points: [
        'Sub-surface irrigation & scheduled soak-dry intervals',
        'pH buffering between 6.0–6.8 for optimal nutrient uptake',
        'Organic bio-char amendments to retain moisture in dry months'
      ]
    },
    {
      title: 'Integrated Organic Pest Protocols',
      icon: '🛡️',
      description: 'Preventative biological controls to deter aphids, spider mites, and scale insects without toxic synthetic pesticide residues.',
      points: [
        'Companion planting: marigold & aromatic herb borders to repel nematodes',
        'Cold-pressed emulsified neem foliar sprays for early fungal suppression',
        'Physical air-circulation standards to prevent powdery mildew'
      ]
    }
  ];

  return (
    <section
      id="for-farmers"
      style={{
        padding: 'var(--space-3xl) 0',
        backgroundColor: '#F3F6F1',
        borderTop: '1px solid var(--color-concrete-light)',
        borderBottom: '1px solid var(--color-concrete-light)',
      }}
    >
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto var(--space-3xl) auto' }}>
          <Badge variant="amber" style={{ marginBottom: 'var(--space-md)' }}>
            🌾 Cultivation & Commercial Growers
          </Badge>
          
          <h2 style={{
            fontSize: 'var(--text-3xl)',
            fontFamily: 'var(--font-serif)',
            color: 'var(--color-forest)',
            marginBottom: 'var(--space-md)',
            lineHeight: 1.25,
          }}>
            Botanical Intelligence for Farmers &amp; Commercial Growers
          </h2>
          
          <p style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-charcoal-muted)',
            lineHeight: 1.6,
          }}>
            Plantify supports progressive agriculturalists, balcony farmers, and greenhouse nursery operators with scientifically verified botanical data, organic soil wisdom, and commercial nursery specimen sourcing.
          </p>
        </div>

        {/* 3 Cultivation pillars */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-xl)',
          marginBottom: 'var(--space-3xl)',
        }}>
          {cultivationGuides.map((guide, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--color-white)',
                padding: 'var(--space-xl)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-concrete-light)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
              }}
            >
              <div style={{ fontSize: '2.2rem', marginBottom: 'var(--space-sm)' }}>
                {guide.icon}
              </div>

              <h3 style={{
                fontSize: 'var(--text-lg)',
                fontFamily: 'var(--font-serif)',
                color: 'var(--color-forest)',
                marginBottom: 'var(--space-xs)',
              }}>
                {guide.title}
              </h3>

              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-charcoal-muted)',
                marginBottom: 'var(--space-md)',
                lineHeight: 1.5,
              }}>
                {guide.description}
              </p>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                marginTop: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-charcoal)',
                borderTop: '1px solid var(--color-concrete-light)',
                paddingTop: 'var(--space-md)',
              }}>
                {guide.points.map((pt, pIdx) => (
                  <li key={pIdx} style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                    <span style={{ color: 'var(--color-forest)', fontWeight: 700 }}>•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Operational Scope Transparency Box */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #D7E3D3',
          borderLeft: '4px solid var(--color-forest)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-lg) var(--space-xl)',
          marginBottom: 'var(--space-2xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>ℹ️</span>
            <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-forest)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Current Agricultural Scope &amp; Transparency Notice
            </strong>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-muted)', lineHeight: 1.6, margin: 0 }}>
            Plantify currently provides verified plant taxonomy, cultivation metrics (light, water, soil drainage), and nursery-verified bulk specimen procurement. Automated satellite soil telemetry, automated drone crop analysis, and IoT sensor hardware integration are future roadmap goals and are not yet operational.
          </p>
        </div>

        {/* Call-to-action buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <Button
            variant="accent"
            size="md"
            onClick={onNavigateToCatalog}
          >
            Explore Agricultural &amp; Fruit Cultivars →
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={onNavigateToContact}
          >
            Inquire About Commercial Bulk Nursery Sourcing
          </Button>
        </div>

      </div>
    </section>
  );
}

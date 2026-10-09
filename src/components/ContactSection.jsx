import React, { useState } from 'react';
import Badge from './Badge.jsx';
import Button from './Button.jsx';

/**
 * ContactSection Component.
 * Features validated contact form with client-side verification, clear loading/error states,
 * verified contact credentials, and an honest email dispatch protocol (no fake backend API success).
 */
export default function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: 'Botanical Care & Cultivar Advice',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const subjectOptions = [
    'Botanical Care & Cultivar Advice',
    'Commercial / Farmer Bulk Sourcing',
    'Order Tracking & Delivery Support',
    'Plant Health / Diagnosis Inquiry',
    'General Feedback or Suggestion'
  ];

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errs.fullName = 'Please enter your full name (at least 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address (e.g., name@example.com).';
    }

    if (!formData.subject.trim()) {
      errs.subject = 'Please choose a subject.';
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Please enter a message of at least 10 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmissionResult(null);

    // Simulate validation and preparation
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionResult({
        validated: true,
        summary: {
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          subject: formData.subject,
          message: formData.message.trim(),
          timestamp: new Date().toLocaleTimeString(),
        }
      });
    }, 450);
  };

  const mailtoUrl = submissionResult
    ? `mailto:support@plantify.com?subject=${encodeURIComponent(`[Plantify Inquiry] ${submissionResult.summary.subject}`)}&body=${encodeURIComponent(
        `Hello Plantify Horticultural Team,\n\nFrom: ${submissionResult.summary.name} (${submissionResult.summary.email})\n\nMessage:\n${submissionResult.summary.message}\n\n--\nSent via Plantify Contact Form`
      )}`
    : '#';

  const handleCopy = () => {
    if (!submissionResult) return;
    const textToCopy = `Subject: ${submissionResult.summary.subject}\nFrom: ${submissionResult.summary.name} <${submissionResult.summary.email}>\nMessage:\n${submissionResult.summary.message}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }).catch(console.warn);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      subject: 'Botanical Care & Cultivar Advice',
      message: '',
    });
    setErrors({});
    setSubmissionResult(null);
  };

  return (
    <section
      id="contact"
      style={{
        padding: 'var(--space-3xl) 0',
        backgroundColor: 'var(--color-off-white)',
        borderBottom: '1px solid var(--color-concrete-light)',
      }}
    >
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto var(--space-3xl) auto' }}>
          <Badge variant="amber" style={{ marginBottom: 'var(--space-md)' }}>
            💬 Direct Botanical Assistance
          </Badge>
          
          <h2 style={{
            fontSize: 'var(--text-3xl)',
            fontFamily: 'var(--font-serif)',
            color: 'var(--color-forest)',
            marginBottom: 'var(--space-md)',
            lineHeight: 1.25,
          }}>
            Connect with Our Botanical Specialists
          </h2>
          
          <p style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-charcoal-muted)',
            lineHeight: 1.6,
          }}>
            Whether you have questions regarding specimen care, wish to place a bulk commercial nursery order, or need assistance tracking an order, we are here to assist you.
          </p>
        </div>

        {/* Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-2xl)',
          alignItems: 'start',
        }}>
          
          {/* Left Column: Verified Contact Information */}
          <div style={{
            backgroundColor: 'var(--color-white)',
            padding: 'var(--space-2xl)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-concrete-light)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-xl)',
          }}>
            <div>
              <h3 style={{
                fontSize: 'var(--text-xl)',
                fontFamily: 'var(--font-serif)',
                color: 'var(--color-forest)',
                marginBottom: 'var(--space-xs)',
              }}>
                Direct Support Channels
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal-muted)', lineHeight: 1.6 }}>
                Reach out to our in-house horticultural specialists. We respond to every botanical inquiry during operating hours.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              
              {/* Email */}
              <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-sage-pale)',
                  color: 'var(--color-forest)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  flexShrink: 0,
                }}>
                  ✉️
                </div>
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-charcoal-light)', fontWeight: 600 }}>
                    Official Inquiries &amp; Support
                  </div>
                  <a
                    href="mailto:support@plantify.com"
                    style={{ fontSize: 'var(--text-base)', color: 'var(--color-forest)', fontWeight: 600 }}
                  >
                    support@plantify.com
                  </a>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-muted)' }}>
                    Typical response time: Under 4 business hours
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-sage-pale)',
                  color: 'var(--color-forest)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  flexShrink: 0,
                }}>
                  📞
                </div>
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-charcoal-light)', fontWeight: 600 }}>
                    Horticultural Helpline
                  </div>
                  <a
                    href="tel:+919876543210"
                    style={{ fontSize: 'var(--text-base)', color: 'var(--color-forest)', fontWeight: 600 }}
                  >
                    +91 98765 43210
                  </a>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-muted)' }}>
                    Mon – Sat: 9:00 AM – 6:00 PM IST
                  </div>
                </div>
              </div>

              {/* Location */}
              <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-sage-pale)',
                  color: 'var(--color-forest)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  flexShrink: 0,
                }}>
                  📍
                </div>
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-charcoal-light)', fontWeight: 600 }}>
                    Botanical Experience Hub
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-forest)', fontWeight: 600 }}>
                    100 Feet Road, Indiranagar
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-muted)' }}>
                    Bengaluru, Karnataka 560038, India
                  </div>
                </div>
              </div>

            </div>

            {/* Note on honesty */}
            <div style={{
              backgroundColor: 'var(--color-off-white)',
              padding: 'var(--space-md)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-concrete-light)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-charcoal-muted)',
              lineHeight: 1.5,
            }}>
              🌿 <strong>Authentic Horticultural Care:</strong> We do not deploy fabricated chat responses. Inquiries are directly reviewed by certified botanical horticulturists.
            </div>

          </div>

          {/* Right Column: Interactive Validated Contact Form */}
          <div style={{
            backgroundColor: 'var(--color-white)',
            padding: 'var(--space-2xl)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-concrete-light)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            
            {submissionResult ? (
              <div style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-md)' }}>
                  <span style={{ fontSize: '24px' }}>✅</span>
                  <h3 style={{
                    fontSize: 'var(--text-xl)',
                    fontFamily: 'var(--font-serif)',
                    color: 'var(--color-forest)',
                    margin: 0,
                  }}>
                    Inquiry Validated &amp; Prepared
                  </h3>
                </div>

                <div style={{
                  backgroundColor: '#F3F8F3',
                  border: '1px solid #C7DFCA',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-md)',
                  marginBottom: 'var(--space-lg)',
                }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-forest)', fontWeight: 700, marginBottom: '6px' }}>
                    TRANSMISSION DISCLOSURE:
                  </div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal)', lineHeight: 1.5, margin: 0 }}>
                    Direct background automated SMTP delivery is currently in developer preview. To guarantee your message is received immediately, transmit it via your default email application or copy the validated contents below.
                  </p>
                </div>

                {/* Inquiry Preview Box */}
                <div style={{
                  backgroundColor: 'var(--color-off-white)',
                  padding: 'var(--space-md)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-concrete-light)',
                  marginBottom: 'var(--space-xl)',
                  fontSize: 'var(--text-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}>
                  <div><strong>From:</strong> {submissionResult.summary.name} &lt;{submissionResult.summary.email}&gt;</div>
                  <div><strong>Subject:</strong> {submissionResult.summary.subject}</div>
                  <div style={{ marginTop: '4px', borderTop: '1px solid var(--color-concrete-light)', paddingTop: '6px' }}>
                    <strong>Message:</strong>
                    <div style={{ whiteSpace: 'pre-wrap', marginTop: '4px', color: 'var(--color-charcoal)' }}>
                      {submissionResult.summary.message}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a
                    href={mailtoUrl}
                    className="btn btn--accent"
                    style={{ textAlign: 'center', justifyContent: 'center' }}
                  >
                    📨 Launch Email to support@plantify.com →
                  </a>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      style={{ flex: 1 }}
                      onClick={handleCopy}
                    >
                      {copied ? '✓ Copied to Clipboard!' : '📋 Copy Message Details'}
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleReset}
                    >
                      Submit Another
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h3 style={{
                  fontSize: 'var(--text-xl)',
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--color-forest)',
                  marginBottom: 'var(--space-lg)',
                }}>
                  Send an Inquiry
                </h3>

                {/* Full Name */}
                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <label
                    htmlFor="contact-fullName"
                    style={{
                      display: 'block',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      color: 'var(--color-forest)',
                      marginBottom: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Your Full Name *
                  </label>
                  <input
                    id="contact-fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      if (errors.fullName) setErrors({ ...errors, fullName: null });
                    }}
                    placeholder="e.g. Radhika Sharma"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${errors.fullName ? '#DC2626' : 'var(--color-concrete-light)'}`,
                      fontSize: 'var(--text-sm)',
                      outline: 'none',
                    }}
                  />
                  {errors.fullName && (
                    <div style={{ color: '#DC2626', fontSize: '11px', marginTop: '4px' }}>
                      {errors.fullName}
                    </div>
                  )}
                </div>

                {/* Email Address */}
                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <label
                    htmlFor="contact-email"
                    style={{
                      display: 'block',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      color: 'var(--color-forest)',
                      marginBottom: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: null });
                    }}
                    placeholder="e.g. radhika@example.com"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${errors.email ? '#DC2626' : 'var(--color-concrete-light)'}`,
                      fontSize: 'var(--text-sm)',
                      outline: 'none',
                    }}
                  />
                  {errors.email && (
                    <div style={{ color: '#DC2626', fontSize: '11px', marginTop: '4px' }}>
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Subject Dropdown */}
                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <label
                    htmlFor="contact-subject"
                    style={{
                      display: 'block',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      color: 'var(--color-forest)',
                      marginBottom: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Inquiry Topic *
                  </label>
                  <select
                    id="contact-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-concrete-light)',
                      fontSize: 'var(--text-sm)',
                      backgroundColor: 'var(--color-white)',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {subjectOptions.map((opt, oIdx) => (
                      <option key={oIdx} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <label
                    htmlFor="contact-message"
                    style={{
                      display: 'block',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      color: 'var(--color-forest)',
                      marginBottom: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Message / Question *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: null });
                    }}
                    placeholder="Describe your plant inquiry, cultivar needs, or order query in detail..."
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${errors.message ? '#DC2626' : 'var(--color-concrete-light)'}`,
                      fontSize: 'var(--text-sm)',
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                  {errors.message && (
                    <div style={{ color: '#DC2626', fontSize: '11px', marginTop: '4px' }}>
                      {errors.message}
                    </div>
                  )}
                </div>

                <Button
                  variant="accent"
                  size="md"
                  type="submit"
                  disabled={isSubmitting}
                  style={{ width: '100%' }}
                >
                  {isSubmitting ? 'Validating Inquiry...' : 'Validate & Prepare Inquiry →'}
                </Button>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}

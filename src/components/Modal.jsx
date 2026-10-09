import React, { useEffect } from 'react';

/**
 * Reusable Accessible Modal Dialog Component.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen Controls visibility
 * @param {Function} props.onClose Callback when user dismisses modal
 * @param {string} [props.title] Modal header title
 * @param {React.ReactNode} props.children Modal content body
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}) {
  // Listen for Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? 'modal-dialog-title' : undefined}
    >
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Close Button */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {title && (
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--color-concrete-light)',
          }}>
            <h2 id="modal-dialog-title" style={{
              fontSize: 'var(--text-xl)',
              color: 'var(--color-forest)',
              margin: 0,
            }}>
              {title}
            </h2>
          </div>
        )}

        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

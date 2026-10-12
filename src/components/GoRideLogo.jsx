import React from 'react';

export default function GoRideLogo({ size = 'normal' }) {
  const isInvoice = size === 'invoice';
  const isSmall = size === 'small';

  const imgHeight = isInvoice ? 84 : isSmall ? 36 : 46;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: isInvoice ? '14px' : '10px' }}>
      <img
        src="/logo.png"
        alt="GoRide Tirupati Cabs"
        style={{
          height: `${imgHeight}px`,
          width: 'auto',
          objectFit: 'contain',
          borderRadius: '8px',
          flexShrink: 0,
        }}
      />
      <div>
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: isInvoice ? '24px' : isSmall ? '16px' : '20px',
            lineHeight: 1.1,
            color: '#0f172a',
            letterSpacing: '-0.3px',
          }}
        >
          Go<span style={{ color: '#d97706' }}>Ride</span>{' '}
          <span style={{ fontSize: isInvoice ? '18px' : '14px', fontWeight: 700, color: '#334155' }}>
            Tirupati Cabs
          </span>
        </div>
        <div
          style={{
            fontSize: isInvoice ? '11px' : '10px',
            fontWeight: 700,
            letterSpacing: '1px',
            color: '#d97706',
            textTransform: 'uppercase',
            marginTop: '2px',
          }}
        >
          Safe • Comfortable • On Time
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';

export default function UpiQrCode({ upiId, payeeName, amount, invoiceNo }) {
  const [imgError, setImgError] = useState(false);
  if (!upiId) return null;

  // Build standard UPI URI string
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    payeeName || 'GoRide Tirupati Cabs'
  )}&am=${amount > 0 ? amount : ''}&cu=INR&tn=${encodeURIComponent(`Invoice ${invoiceNo || 'Bill'}`)}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&margin=2&data=${encodeURIComponent(
    upiUrl
  )}`;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 10px',
        background: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
      }}
    >
      <div
        style={{
          width: '74px',
          height: '74px',
          background: '#ffffff',
          padding: '2px',
          borderRadius: '6px',
          border: '1px solid #cbd5e1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {!imgError ? (
          <img
            src={qrImageUrl}
            alt="UPI QR Code"
            crossOrigin="anonymous"
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <div style={{ fontSize: '9px', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>
            UPI QR
          </div>
        )}
      </div>
      <div>
        <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
          Scan & Pay with UPI
        </div>
        <div style={{ fontSize: '9.5px', color: '#64748b', marginTop: '1px' }}>
          GPay • PhonePe • Paytm • BHIM
        </div>
        <div
          style={{
            fontSize: '11px',
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            color: '#1d4ed8',
            marginTop: '3px',
            background: '#eff6ff',
            padding: '2px 6px',
            borderRadius: '4px',
            display: 'inline-block',
          }}
        >
          {upiId}
        </div>
      </div>
    </div>
  );
}


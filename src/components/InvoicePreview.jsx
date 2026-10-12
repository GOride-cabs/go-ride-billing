import React from 'react';
import UpiQrCode from './UpiQrCode';
import { computeInvoice } from '../utils/calculations';
import { numberToIndianWords, formatINR } from '../utils/numberToWords';
import { Phone, Mail, MapPin, Globe, Car, User, Navigation, Calendar } from 'lucide-react';

export default function InvoicePreview({ invoice, company, id = "invoice-printable" }) {
  const calc = computeInvoice(invoice);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0', label: 'PAID IN FULL' };
      case 'Partially Paid':
        return { bg: '#fffbeb', text: '#92400e', border: '#fde68a', label: 'PARTIALLY PAID' };
      default:
        return { bg: '#fef2f2', text: '#991b1b', border: '#fecaca', label: 'PAYMENT PENDING' };
    }
  };

  const statusBadge = getStatusBadge(invoice.paymentStatus);

  return (
    <div
      id={id}
      className="invoice-print-container"
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '20px 22px',
        border: '1px solid #cbd5e1',
        maxWidth: '780px',
        width: '100%',
        margin: '0 auto',
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
        color: '#0f172a',
        boxSizing: 'border-box',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* 1. TOP HEADER BRANDING */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '2.5px solid #0f172a',
          paddingBottom: '12px',
          gap: '14px',
        }}
      >
        {/* Left: Official Logo & Proprietor Details */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/logo.png"
              alt="GoRide Tirupati Cabs"
              style={{
                height: '76px',
                width: 'auto',
                objectFit: 'contain',
                borderRadius: '6px',
                flexShrink: 0,
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 900,
                  fontSize: '22px',
                  lineHeight: 1.1,
                  color: '#0f172a',
                  letterSpacing: '-0.3px',
                }}
              >
                Go<span style={{ color: '#d97706' }}>Ride</span>{' '}
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#334155' }}>
                  TIRUPATI CABS
                </span>
              </div>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '0.8px',
                  color: '#d97706',
                  textTransform: 'uppercase',
                  marginTop: '1px',
                }}
              >
                24/7 Tirupati & Tirumala Pilgrim Cab Services
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b', marginTop: '3px' }}>
                {company.proprietor || 'N Viswanadham'}{' '}
                <span style={{ fontSize: '10px', fontWeight: 600, color: '#64748b' }}>
                  ({company.designation || 'Managing Proprietor'})
                </span>
              </div>
            </div>
          </div>

          {/* Contact Details Line */}
          <div
            style={{
              marginTop: '8px',
              fontSize: '11px',
              color: '#334155',
              lineHeight: 1.45,
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={12} color="#d97706" style={{ flexShrink: 0 }} />
              <span>
                <strong>Mobile / WhatsApp:</strong> {company.ownerContact || '+91 85009 53558'}
              </span>
            </div>

            {company.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={12} color="#d97706" style={{ flexShrink: 0 }} />
                <span>{company.email}</span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <MapPin size={12} color="#d97706" style={{ marginTop: '2px', flexShrink: 0 }} />
              <span>{company.address || 'Tirupati, Andhra Pradesh - 517501'}</span>
            </div>

            {company.website && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563eb' }}>
                <Globe size={12} color="#2563eb" style={{ flexShrink: 0 }} />
                <span style={{ fontWeight: 600 }}>{company.website}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Invoice Number & Date Box */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div
            style={{
              display: 'inline-block',
              background: '#0f172a',
              color: '#ffffff',
              padding: '4px 10px',
              borderRadius: '6px',
              fontWeight: 800,
              fontFamily: "'Outfit', sans-serif",
              fontSize: '12px',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
            }}
          >
            TRIP INVOICE & DUTY SLIP
          </div>

          <div style={{ marginTop: '8px' }}>
            <div style={{ color: '#64748b', fontSize: '9.5px', textTransform: 'uppercase', fontWeight: 700 }}>
              Invoice Number
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: '13.5px', color: '#0f172a' }}>
              {invoice.invoiceNumber || 'GRT-202610-001'}
            </div>
          </div>

          <div style={{ marginTop: '4px' }}>
            <div style={{ color: '#64748b', fontSize: '9.5px', textTransform: 'uppercase', fontWeight: 700 }}>
              Date of Issue
            </div>
            <div style={{ fontWeight: 700, fontSize: '11.5px', color: '#1e293b' }}>
              {invoice.invoiceDate || 'N/A'}
            </div>
          </div>

          <div style={{ marginTop: '6px' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontSize: '10px',
                fontWeight: 800,
                textTransform: 'uppercase',
                background: statusBadge.bg,
                color: statusBadge.text,
                border: `1px solid ${statusBadge.border}`,
              }}
            >
              ● {statusBadge.label}
            </span>
          </div>
        </div>
      </div>

      {/* 2. CUSTOMER & VEHICLE DETAILS GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          padding: '10px 0',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        {/* Customer Details Box */}
        <div
          style={{
            background: '#f8fafc',
            padding: '9px 12px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
          }}
        >
          <div
            style={{
              fontSize: '9.5px',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#d97706',
              letterSpacing: '0.6px',
              marginBottom: '3px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <User size={11} /> Passenger / Billed To
          </div>

          <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>
            {invoice.customerName || 'Customer / Devotee Name'}
          </div>

          <div style={{ fontSize: '11.5px', color: '#334155', marginBottom: '2px' }}>
            <strong>Mobile:</strong> {invoice.customerMobile || 'N/A'}
          </div>

          {invoice.customerEmail && (
            <div style={{ fontSize: '11px', color: '#475569', marginBottom: '3px' }}>
              <strong>Email:</strong> {invoice.customerEmail}
            </div>
          )}

          <div
            style={{
              marginTop: '5px',
              paddingTop: '5px',
              borderTop: '1px dashed #cbd5e1',
              fontSize: '11px',
              lineHeight: 1.4,
            }}
          >
            <div>
              <span style={{ color: '#059669', fontWeight: 800 }}>Pickup:</span>{' '}
              {invoice.pickupLocation || 'Tirupati (Doorstep / Station / Airport)'}
            </div>
            <div>
              <span style={{ color: '#dc2626', fontWeight: 800 }}>Drop:</span>{' '}
              {invoice.dropLocation || 'Tirumala Hill / Temple Destination'}
            </div>
          </div>
        </div>

        {/* Vehicle & Trip Info Box */}
        <div
          style={{
            background: '#f8fafc',
            padding: '9px 12px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
          }}
        >
          <div
            style={{
              fontSize: '9.5px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              color: '#2563eb',
              marginBottom: '3px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Car size={11} /> Vehicle & Route Details
          </div>

          {invoice.tripPackageName && (
            <div
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#92400e',
                background: '#fef3c7',
                padding: '2px 6px',
                borderRadius: '4px',
                display: 'inline-block',
                marginBottom: '3px',
              }}
            >
              📍 {invoice.tripPackageName}
            </div>
          )}

          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>
            {invoice.carType || 'Swift Dzire (Sedan - 4 + 1 Seater)'}
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
            {invoice.vehicleNumber && (
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  background: '#e2e8f0',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  color: '#0f172a',
                }}
              >
                {invoice.vehicleNumber}
              </span>
            )}
            {invoice.driverName && (
              <span style={{ fontSize: '11px', color: '#475569' }}>
                Chauffeur: <strong>{invoice.driverName}</strong>
              </span>
            )}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '6px',
              marginTop: '4px',
              paddingTop: '5px',
              borderTop: '1px dashed #cbd5e1',
              fontSize: '11px',
            }}
          >
            <div style={{ background: '#ffffff', padding: '3px 6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b', fontSize: '9px', display: 'block' }}>Distance:</span>
              <strong style={{ fontSize: '11.5px', color: '#0f172a' }}>
                {invoice.totalKm ? `${invoice.totalKm} KM` : '—'}
              </strong>
            </div>

            <div style={{ background: '#ffffff', padding: '3px 6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b', fontSize: '9px', display: 'block' }}>Duration:</span>
              <strong style={{ fontSize: '11.5px', color: '#0f172a' }}>
                {invoice.hoursUsed ? `${invoice.hoursUsed} Hours` : '—'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2.5 SACRED SIGHTS VISITED (IF ANY) */}
      {invoice.selectedSights && invoice.selectedSights.length > 0 && (
        <div
          style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '6px',
            padding: '6px 9px',
            margin: '8px 0',
          }}
        >
          <div
            style={{
              fontSize: '9.5px',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#92400e',
              letterSpacing: '0.4px',
              marginBottom: '3px',
            }}
          >
            🛕 Pilgrimage Sightseeing Itinerary Covered ({invoice.selectedSights.length} Sights):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
            {invoice.selectedSights.map((s, idx) => (
              <span
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid #fcd34d',
                  borderRadius: '3px',
                  padding: '1px 5px',
                  fontSize: '9.5px',
                  fontWeight: 600,
                  color: '#78350f',
                }}
              >
                ✓ {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 3. ITEMIZED CHARGES TABLE */}
      <div style={{ margin: '10px 0 8px 0' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '11.5px',
          }}
        >
          <thead>
            <tr
              style={{
                background: '#0f172a',
                color: '#ffffff',
                fontFamily: "'Outfit', sans-serif",
                fontSize: '10.5px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              <th style={{ padding: '6px 8px', borderRadius: '5px 0 0 5px', width: '28px' }}>#</th>
              <th style={{ padding: '6px 8px' }}>Tariff / Service Description</th>
              <th style={{ padding: '6px 8px', textAlign: 'center', width: '85px' }}>Units</th>
              <th style={{ padding: '6px 8px', textAlign: 'right', width: '85px' }}>Rate (₹)</th>
              <th style={{ padding: '6px 8px', textAlign: 'right', borderRadius: '0 5px 5px 0', width: '100px' }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {calc.lineItems.map((item, index) => (
              <tr
                key={item.id}
                style={{
                  borderBottom: '1px solid #e2e8f0',
                  background: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                }}
              >
                <td style={{ padding: '6px 8px', color: '#64748b', fontWeight: 600 }}>{index + 1}</td>
                <td style={{ padding: '6px 8px', fontWeight: 600, color: '#1e293b' }}>
                  {item.description}
                </td>
                <td style={{ padding: '6px 8px', textAlign: 'center', color: '#475569' }}>
                  {item.qty}
                </td>
                <td style={{ padding: '6px 8px', textAlign: 'right', color: '#475569' }}>
                  {item.rate}
                </td>
                <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                  {formatINR(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. TOTALS & SUMMARY SECTION */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '12px',
          paddingTop: '4px',
          alignItems: 'flex-start',
        }}
      >
        {/* Left: Words, Payment Method & UPI QR */}
        <div>
          {/* Amount In Words Card */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '6px 8px',
              marginBottom: '6px',
            }}
          >
            <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
              Amount in Words:
            </div>
            <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#0f172a', fontStyle: 'italic', marginTop: '1px' }}>
              {numberToIndianWords(calc.grandTotal)}
            </div>
          </div>

          <div style={{ fontSize: '10.5px', color: '#475569', marginBottom: '6px' }}>
            <span><strong>Payment Mode:</strong> {invoice.paymentMode || 'Cash'}</span>
            {invoice.specialNotes && (
              <div style={{ fontSize: '10px', color: '#64748b', marginTop: '1px' }}>
                Note: {invoice.specialNotes}
              </div>
            )}
          </div>

          {invoice.balanceDue > 0 && company.upiId && (
            <div style={{ transform: 'scale(0.92)', transformOrigin: 'top left' }}>
              <UpiQrCode
                upiId={company.upiId}
                payeeName={company.name}
                amount={invoice.balanceDue}
                invoiceNo={invoice.invoiceNumber}
              />
            </div>
          )}
        </div>

        {/* Right: Numbers Breakdown */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '10px 12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', fontSize: '11px' }}>
            <span style={{ color: '#64748b' }}>Subtotal:</span>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatINR(calc.subtotal)}</span>
          </div>

          {calc.discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', fontSize: '11px', color: '#059669' }}>
              <span>Discount:</span>
              <span style={{ fontWeight: 600 }}>- {formatINR(calc.discount)}</span>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              padding: '6px 0',
              borderTop: '2px solid #0f172a',
              borderBottom: '1px solid #cbd5e1',
              margin: '3px 0',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', fontFamily: "'Outfit', sans-serif" }}>
              TOTAL PAYABLE:
            </span>
            <span style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', fontFamily: "'Outfit', sans-serif" }}>
              {formatINR(calc.grandTotal)}
            </span>
          </div>

          {calc.advancePaid > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0', fontSize: '11px', color: '#059669' }}>
              <span>Advance Received:</span>
              <span style={{ fontWeight: 600 }}>{formatINR(calc.advancePaid)}</span>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '4px',
              padding: '5px 8px',
              borderRadius: '5px',
              background: calc.balanceDue > 0 ? '#fef2f2' : '#ecfdf5',
              border: `1px solid ${calc.balanceDue > 0 ? '#fecaca' : '#a7f3d0'}`,
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 700, color: calc.balanceDue > 0 ? '#991b1b' : '#065f46' }}>
              {calc.balanceDue > 0 ? 'Balance Due:' : 'Status:'}
            </span>
            <span style={{ fontSize: '13px', fontWeight: 800, color: calc.balanceDue > 0 ? '#991b1b' : '#065f46' }}>
              {calc.balanceDue > 0 ? formatINR(calc.balanceDue) : 'PAID IN FULL'}
            </span>
          </div>
        </div>
      </div>

      {/* 5. TERMS & SIGNATURE FOOTER */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: '12px',
          marginTop: '10px',
          paddingTop: '8px',
          borderTop: '1px solid #e2e8f0',
          alignItems: 'flex-end',
        }}
      >
        <div>
          <div style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', color: '#475569', letterSpacing: '0.4px', marginBottom: '2px' }}>
            Terms & Conditions:
          </div>
          <div style={{ fontSize: '8.5px', color: '#64748b', lineHeight: 1.35, whiteSpace: 'pre-line' }}>
            {company.termsAndConditions || '1. Toll charges & parking fees charged as per actual receipts.\n2. AC may be switched off on steep ghat uphill roads for engine safety.\n3. All disputes subject to Tirupati jurisdiction.'}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#0f172a', marginBottom: '18px' }}>
            For {company.name || 'GoRide Tirupati Cabs'}
          </div>
          <div style={{ borderTop: '1px solid #0f172a', paddingTop: '3px', fontSize: '10.5px', color: '#0f172a', fontWeight: 800 }}>
            {company.proprietor || 'N Viswanadham'}
          </div>
          <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 600 }}>
            {company.designation || 'Managing Proprietor'}
          </div>
        </div>
      </div>

      {/* Divine Blessing Footer Bar */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '8px',
          paddingTop: '5px',
          borderTop: '1px solid #f1f5f9',
          fontSize: '9.5px',
          color: '#d97706',
          fontWeight: 700,
          letterSpacing: '0.3px',
        }}
      >
        🙏 Om Namo Venkatesaya • Thank you for choosing GoRide Tirupati Cabs! Have a blessed Darshan!
      </div>
    </div>
  );
}

import React from 'react';
import {
  Printer,
  Save,
  Clock,
  Settings,
  MessageCircle,
  Download,
  Share2
} from 'lucide-react';
import { computeInvoice } from '../utils/calculations';
import { formatINR } from '../utils/numberToWords';

export default function HeaderNav({
  invoice,
  company,
  onDownloadPdf,
  onPrint,
  onSave,
  onReset,
  onOpenHistory,
  onOpenSettings,
  savedCount,
  viewMode,
  setViewMode,
  isGeneratingPdf
}) {
  const handleWhatsAppShare = () => {
    if (!invoice.customerMobile) {
      alert('Please enter customer mobile number first!');
      return;
    }

    const calc = computeInvoice(invoice);
    const phone = invoice.customerMobile.replace(/[^0-9]/g, '');

    const text = `*🚕 GORIDE TIRUPATI CABS - TRIP BILL*
---------------------------------------
*Invoice No:* ${invoice.invoiceNumber}
*Customer:* ${invoice.customerName}
*Vehicle:* ${invoice.carType} (${invoice.vehicleNumber || 'Cab'})
*Trip:* ${invoice.pickupLocation} ➡️ ${invoice.dropLocation}
*Total Distance:* ${invoice.totalKm ? `${invoice.totalKm} KM` : 'N/A'}
*Trip Duration:* ${invoice.hoursUsed ? `${invoice.hoursUsed} Hours` : 'N/A'}
---------------------------------------
*Total Payable:* ${formatINR(calc.grandTotal)}
*Advance Paid:* ${formatINR(calc.advancePaid)}
*Balance Due:* ${formatINR(calc.balanceDue)}
*Payment Status:* ${invoice.paymentStatus}
---------------------------------------
Thank you for riding with GoRide Tirupati Cabs! Have a blessed Darshan of Lord Venkateswara Swami! 🙏
_Contact:_ ${company.proprietor || 'N Viswanadham'} (${company.ownerContact})`;

    const url = `https://wa.me/${phone.length === 10 ? `91${phone}` : phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <header
      className="no-print"
      style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '10px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="/logo.png"
            alt="GoRide Tirupati Cabs"
            style={{
              height: '38px',
              width: 'auto',
              objectFit: 'contain',
              borderRadius: '6px',
            }}
          />
          <div>
            <div
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 900,
                fontSize: '17px',
                lineHeight: 1.1,
                color: '#0f172a',
                letterSpacing: '-0.3px',
              }}
            >
              Go<span style={{ color: '#d97706' }}>Ride</span>{' '}
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>
                Tirupati Cabs
              </span>
            </div>
            <div
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>● 24/7 Cab Billing</span>
            </div>
          </div>
        </div>

        {/* Desktop View Switcher (Hidden on narrow screens where the mobile tabs handle it) */}
        <div
          className="desktop-only-nav"
          style={{
            display: 'flex',
            background: '#f1f5f9',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode('form')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: 700,
              background: viewMode === 'form' ? '#ffffff' : 'transparent',
              color: viewMode === 'form' ? '#0f172a' : '#64748b',
              boxShadow: viewMode === 'form' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            Form
          </button>

          <button
            type="button"
            onClick={() => setViewMode('preview')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: 700,
              background: viewMode === 'preview' ? '#ffffff' : 'transparent',
              color: viewMode === 'preview' ? '#0f172a' : '#64748b',
              boxShadow: viewMode === 'preview' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            Bill Preview
          </button>

          <button
            type="button"
            onClick={() => setViewMode('split')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: 700,
              background: viewMode === 'split' ? '#ffffff' : 'transparent',
              color: viewMode === 'split' ? '#0f172a' : '#64748b',
              boxShadow: viewMode === 'split' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            Dual View
          </button>
        </div>

        {/* Header Right Action Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Desktop WhatsApp & PDF Buttons */}
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="desktop-only-btn"
            title="Send formatted bill on WhatsApp"
            style={{
              background: '#25d366',
              color: '#ffffff',
              border: 'none',
              padding: '7px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <MessageCircle size={15} />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={onDownloadPdf}
            disabled={isGeneratingPdf}
            className="desktop-only-btn"
            title="Download formatted A4 PDF file"
            style={{
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(217, 119, 6, 0.35)',
              cursor: isGeneratingPdf ? 'wait' : 'pointer',
            }}
          >
            <Download size={14} />
            <span>{isGeneratingPdf ? 'Saving...' : 'Download PDF'}</span>
          </button>

          {/* Quick Print Button (Desktop) */}
          <button
            type="button"
            onClick={onPrint}
            className="desktop-only-btn"
            title="Open browser print dialog"
            style={{
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              padding: '7px 10px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Printer size={13} />
          </button>

          {/* Save Draft */}
          <button
            type="button"
            onClick={onSave}
            title="Save draft"
            style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              padding: '7px 10px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Save size={14} />
            <span className="desktop-only-label">Save</span>
          </button>

          {/* History */}
          <button
            type="button"
            onClick={onOpenHistory}
            title="View saved invoices history"
            style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              padding: '7px 10px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Clock size={14} />
            {savedCount > 0 && (
              <span
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  fontSize: '9.5px',
                  fontWeight: 800,
                  padding: '1px 5px',
                  borderRadius: '9999px',
                }}
              >
                {savedCount}
              </span>
            )}
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={onOpenSettings}
            title="Company & Contact Settings"
            style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              padding: '7px 10px',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#475569',
            }}
          >
            <Settings size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}

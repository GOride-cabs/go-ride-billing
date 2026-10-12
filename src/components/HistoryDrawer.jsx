import React, { useState } from 'react';
import { X, Search, Trash2, ExternalLink, Clock, User, Phone, Car } from 'lucide-react';
import { formatINR } from '../utils/numberToWords';

export default function HistoryDrawer({ isOpen, onClose, savedInvoices, onLoadInvoice, onDeleteInvoice }) {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = (savedInvoices || []).filter((inv) => {
    const q = search.toLowerCase();
    return (
      (inv.customerName || '').toLowerCase().includes(q) ||
      (inv.customerMobile || '').toLowerCase().includes(q) ||
      (inv.invoiceNumber || '').toLowerCase().includes(q) ||
      (inv.vehicleNumber || '').toLowerCase().includes(q) ||
      (inv.carType || '').toLowerCase().includes(q)
    );
  });

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(3px)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          background: '#ffffff',
          boxShadow: '-10px 0 25px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f8fafc',
          }}
        >
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
              Past Invoices ({savedInvoices?.length || 0})
            </h3>
            <div style={{ fontSize: '11px', color: '#64748b' }}>
              Saved locally on this device
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              padding: '6px',
              borderRadius: '6px',
              color: '#64748b',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search by customer, phone, invoice #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
              }}
            />
          </div>
        </div>

        {/* Invoices List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
              <Clock size={36} style={{ margin: '0 auto 12px auto', strokeWidth: 1.5 }} />
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>No invoices found</div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>
                Generate or save an invoice to see it here.
              </div>
            </div>
          ) : (
            filtered.map((inv) => (
              <div
                key={inv.invoiceNumber}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#2563eb',
                        background: '#eff6ff',
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      {inv.invoiceNumber}
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '6px' }}>
                      {inv.invoiceDate}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: inv.paymentStatus === 'Paid' ? '#ecfdf5' : '#fffbeb',
                      color: inv.paymentStatus === 'Paid' ? '#065f46' : '#92400e',
                    }}
                  >
                    {inv.paymentStatus}
                  </span>
                </div>

                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                    {inv.customerName || 'Unnamed Customer'}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                    {inv.customerMobile} • {inv.carType}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '8px',
                    borderTop: '1px dashed #e2e8f0',
                  }}
                >
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    {inv.totalKm ? `${inv.totalKm} KM` : ''} {inv.hoursUsed ? `• ${inv.hoursUsed} Hrs` : ''}
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => onLoadInvoice(inv)}
                      style={{
                        background: '#0f172a',
                        color: '#ffffff',
                        border: 'none',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      <ExternalLink size={12} /> Open
                    </button>
                    <button
                      onClick={() => onDeleteInvoice(inv.invoiceNumber)}
                      style={{
                        background: '#fee2e2',
                        color: '#b91c1c',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

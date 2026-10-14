import React, { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  Car,
  Clock,
  Gauge,
  Receipt,
  Download,
  Printer,
  Sparkles,
  RotateCcw,
  IndianRupee,
  MapPin,
  CheckCircle,
  Navigation,
  Compass,
  ChevronDown,
  ChevronUp,
  Calendar,
  Hash,
  Tag,
  FileText,
  Sliders,
  DollarSign
} from 'lucide-react';
import {
  CAR_TYPES,
  OFFICIAL_TRIP_PACKAGES,
  SIGHTSEEING_ATTRACTIONS,
  generateInvoiceNumber,
  getTodayDateString
} from '../data/defaults';

export default function InvoiceForm({
  invoice,
  setInvoice,
  onReset,
  onLoadSample,
  onDownloadPdf,
  onPrint,
  isGeneratingPdf
}) {
  const [sightsOpen, setSightsOpen] = useState(false);
  const [entryMode, setEntryMode] = useState('guided'); // 'guided' | 'manual'

  const handleChange = (field, value) => {
    setInvoice((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const selectCar = (car) => {
    setInvoice((prev) => ({
      ...prev,
      carType: car.name,
      ratePerKm: car.defaultPerKm,
      hourlyRate: car.defaultHourly,
    }));
  };

  const handleTripSelect = (pkg) => {
    setInvoice((prev) => ({
      ...prev,
      tripPackageName: pkg.name,
      pickupLocation: pkg.pickup,
      dropLocation: pkg.drop,
      totalKm: pkg.distanceKm,
      hoursUsed: pkg.hours,
      specialNotes: pkg.notes,
    }));
  };

  const handleRegenerateInvoiceNo = () => {
    const newNo = generateInvoiceNumber();
    handleChange('invoiceNumber', newNo);
  };

  const handleSetTodayDate = () => {
    handleChange('invoiceDate', getTodayDateString());
  };

  const handleToggleSight = (sightName) => {
    setInvoice((prev) => {
      const current = prev.selectedSights || [];
      const updated = current.includes(sightName)
        ? current.filter((s) => s !== sightName)
        : [...current, sightName];
      return { ...prev, selectedSights: updated };
    });
  };

  const handleSelectAllSights = () => {
    setInvoice((prev) => ({
      ...prev,
      selectedSights: SIGHTSEEING_ATTRACTIONS.map((s) => s.name),
    }));
  };

  const handleSelectHilltopSights = () => {
    setInvoice((prev) => ({
      ...prev,
      selectedSights: SIGHTSEEING_ATTRACTIONS.filter((s) => s.location === 'Hilltop').map((s) => s.name),
    }));
  };

  const handleSelectValleySights = () => {
    setInvoice((prev) => ({
      ...prev,
      selectedSights: SIGHTSEEING_ATTRACTIONS.filter((s) => s.location === 'Valley').map((s) => s.name),
    }));
  };

  const handleClearSights = () => {
    setInvoice((prev) => ({
      ...prev,
      selectedSights: [],
    }));
  };

  const billingModel = invoice.billingModel || 'both';

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Top Header & Quick Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          paddingBottom: '14px',
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
            Owner Booking & Billing Desk
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b' }}>
            GoRide Tirupati Cabs • N Viswanadham
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={onLoadSample}
            style={{
              background: '#fef3c7',
              border: '1px solid #fde68a',
              color: '#92400e',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
            }}
          >
            <Sparkles size={13} color="#d97706" /> Sample
          </button>

          <button
            type="button"
            onClick={onReset}
            style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              color: '#475569',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={13} /> Clear
          </button>
        </div>
      </div>

      {/* ENTRY MODE SWITCHER (Guided Presets vs 100% Manual Entry) */}
      <div
        style={{
          background: '#f8fafc',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4px',
        }}
      >
        <button
          type="button"
          onClick={() => setEntryMode('guided')}
          style={{
            padding: '9px 12px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '12.5px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            background: entryMode === 'guided' ? '#ffffff' : 'transparent',
            color: entryMode === 'guided' ? '#d97706' : '#64748b',
            boxShadow: entryMode === 'guided' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
          }}
        >
          <Sparkles size={14} color={entryMode === 'guided' ? '#d97706' : '#94a3b8'} />
          <span>⚡ Guided Tour Presets</span>
        </button>

        <button
          type="button"
          onClick={() => setEntryMode('manual')}
          style={{
            padding: '9px 12px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '12.5px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            background: entryMode === 'manual' ? '#ffffff' : 'transparent',
            color: entryMode === 'manual' ? '#2563eb' : '#64748b',
            boxShadow: entryMode === 'manual' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
          }}
        >
          <Sliders size={14} color={entryMode === 'manual' ? '#2563eb' : '#94a3b8'} />
          <span>✍️ 100% Manual Entry Mode</span>
        </button>
      </div>

      {/* PRIMARY DOWNLOAD PDF & PRINT BUTTONS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '10px' }}>
        <button
          type="button"
          onClick={onDownloadPdf}
          disabled={isGeneratingPdf}
          style={{
            background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '12px 18px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(217, 119, 6, 0.35)',
            cursor: isGeneratingPdf ? 'wait' : 'pointer',
          }}
        >
          <Download size={18} />
          {isGeneratingPdf ? 'Preparing PDF...' : 'Download PDF Invoice'}
        </button>

        <button
          type="button"
          onClick={onPrint}
          style={{
            background: '#0f172a',
            color: '#ffffff',
            border: 'none',
            padding: '12px 14px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          <Printer size={16} /> Print
        </button>
      </div>

      {/* SECTION 1: INVOICE NUMBER, DATE & TRIP TIMING (MANUAL ENTRY) */}
      <div
        style={{
          background: '#f8fafc',
          padding: '14px 16px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: '#475569',
            letterSpacing: '0.6px',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Hash size={14} color="#64748b" /> 1. Bill Number & Issue Date (Manual Entry)
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#334155' }}>
              Invoice / Bill Number *
            </label>
            <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
              <input
                type="text"
                value={invoice.invoiceNumber || ''}
                onChange={(e) => handleChange('invoiceNumber', e.target.value)}
                placeholder="e.g. GRT-202610-001"
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: '#0f172a',
                }}
              />
              <button
                type="button"
                onClick={handleRegenerateInvoiceNo}
                title="Generate new invoice number"
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#475569',
                  cursor: 'pointer',
                }}
              >
                🔄 New
              </button>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#334155' }}>
              Date of Issue *
            </label>
            <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
              <input
                type="date"
                value={invoice.invoiceDate || ''}
                onChange={(e) => handleChange('invoiceDate', e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              />
              <button
                type="button"
                onClick={handleSetTodayDate}
                title="Set to today"
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#2563eb',
                  cursor: 'pointer',
                }}
              >
                Today
              </button>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#475569' }}>
              Trip / Journey Date & Time (Optional)
            </label>
            <input
              type="text"
              value={invoice.pickupDateTime || ''}
              onChange={(e) => handleChange('pickupDateTime', e.target.value)}
              placeholder="e.g. 15-Oct-2026, 06:00 AM"
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                marginTop: '4px',
              }}
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: TRIP / PACKAGE SELECTOR & MANUAL ROUTE ENTRY */}
      <div
        style={{
          background: '#f8fafc',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: '#d97706',
            letterSpacing: '0.6px',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Compass size={15} /> 2. Trip Name & Destination Route
          </div>
          <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700, textTransform: 'none' }}>
            ✍️ Fully Editable
          </span>
        </div>

        {/* Guided Package Selector (Shown when in guided mode) */}
        {entryMode === 'guided' && (
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
              ⚡ 1-Click Popular Tour Packages (Auto-fills route & KM):
            </label>
            <select
              value={invoice.tripPackageName || ''}
              onChange={(e) => {
                const found = OFFICIAL_TRIP_PACKAGES.find((p) => p.name === e.target.value);
                if (found) handleTripSelect(found);
                else handleChange('tripPackageName', e.target.value);
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '2px solid #f59e0b',
                fontSize: '13px',
                background: '#ffffff',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '8px',
              }}
            >
              {OFFICIAL_TRIP_PACKAGES.map((pkg) => (
                <option key={pkg.id} value={pkg.name}>
                  {pkg.name} — [{pkg.badge} • {pkg.distanceKm} KM]
                </option>
              ))}
            </select>

            {/* Quick Click Badges for All 9 Official Packages */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {OFFICIAL_TRIP_PACKAGES.slice(0, 9).map((pkg) => {
                const isCurrent = invoice.tripPackageName === pkg.name;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => handleTripSelect(pkg)}
                    style={{
                      fontSize: '11px',
                      padding: '5px 9px',
                      borderRadius: '6px',
                      border: isCurrent ? '2px solid #d97706' : '1px solid #cbd5e1',
                      background: isCurrent ? '#fef3c7' : '#ffffff',
                      color: isCurrent ? '#92400e' : '#334155',
                      fontWeight: isCurrent ? 800 : 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: isCurrent ? '0 1px 3px rgba(217, 119, 6, 0.2)' : 'none',
                    }}
                  >
                    <span>{pkg.name}</span>
                    <span
                      style={{
                        background: isCurrent ? '#fde68a' : '#f1f5f9',
                        color: isCurrent ? '#78350f' : '#64748b',
                        fontSize: '10px',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        fontWeight: 700,
                      }}
                    >
                      {pkg.distanceKm} km
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* DIRECT MANUAL ENTRY FOR ROUTE DETAILS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
              Trip / Tour Package Title * (Manual Entry)
            </label>
            <input
              type="text"
              placeholder="e.g. Tirupati to Tirumala 1-Day, Chennai Airport Drop, Arunachalam Temple Circuit..."
              value={invoice.tripPackageName || ''}
              onChange={(e) => handleChange('tripPackageName', e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13.5px',
                fontWeight: 600,
                marginTop: '4px',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                Pickup Location *
              </label>
              <input
                type="text"
                placeholder="e.g. Tirupati Railway Station, Hotel Bliss"
                value={invoice.pickupLocation || ''}
                onChange={(e) => handleChange('pickupLocation', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  marginTop: '4px',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                Drop Location *
              </label>
              <input
                type="text"
                placeholder="e.g. Tirumala Hill Cottage / Darshan"
                value={invoice.dropLocation || ''}
                onChange={(e) => handleChange('dropLocation', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  marginTop: '4px',
                }}
              />
            </div>
          </div>
        </div>

        {/* 13 SACRED SIGHTS & ATTRACTIONS SELECTOR (COLLAPSIBLE FOR MOBILE) */}
        <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed #cbd5e1' }}>
          <div
            onClick={() => setSightsOpen(!sightsOpen)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '9px 12px',
              background: sightsOpen ? '#fef3c7' : '#ffffff',
              borderRadius: '8px',
              border: sightsOpen ? '1px solid #f59e0b' : '1px solid #cbd5e1',
              userSelect: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a' }}>
                🛕 Optional: 13 Sacred Sights Itinerary
              </span>
              <span
                style={{
                  background: (invoice.selectedSights?.length || 0) > 0 ? '#10b981' : '#e2e8f0',
                  color: (invoice.selectedSights?.length || 0) > 0 ? '#ffffff' : '#64748b',
                  fontSize: '10.5px',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: '9999px',
                }}
              >
                {invoice.selectedSights?.length || 0} / 13
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: '#d97706' }}>
              <span>{sightsOpen ? 'Hide' : 'Tap to Select'}</span>
              {sightsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          </div>

          {sightsOpen && (
            <div style={{ marginTop: '10px', animation: 'fadeIn 0.2s ease-out' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px', marginBottom: '8px' }}>
                <button
                  type="button"
                  onClick={handleSelectAllSights}
                  style={{ fontSize: '10.5px', padding: '3px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', fontWeight: 700, color: '#2563eb', cursor: 'pointer' }}
                >
                  All (13)
                </button>
                <button
                  type="button"
                  onClick={handleSelectHilltopSights}
                  style={{ fontSize: '10.5px', padding: '3px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', fontWeight: 700, color: '#d97706', cursor: 'pointer' }}
                >
                  Hilltop (8)
                </button>
                <button
                  type="button"
                  onClick={handleSelectValleySights}
                  style={{ fontSize: '10.5px', padding: '3px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', fontWeight: 700, color: '#059669', cursor: 'pointer' }}
                >
                  Valley (5)
                </button>
                <button
                  type="button"
                  onClick={handleClearSights}
                  style={{ fontSize: '10.5px', padding: '3px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}
                >
                  Clear
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '6px' }}>
                {SIGHTSEEING_ATTRACTIONS.map((sight) => {
                  const isChecked = (invoice.selectedSights || []).includes(sight.name);
                  return (
                    <label
                      key={sight.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '6px',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        border: isChecked ? '1px solid #f59e0b' : '1px solid #e2e8f0',
                        background: isChecked ? '#fffbeb' : '#ffffff',
                        cursor: 'pointer',
                        fontSize: '11px',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleSight(sight.name)}
                        style={{ marginTop: '2px', cursor: 'pointer' }}
                      />
                      <div>
                        <div style={{ fontWeight: isChecked ? 700 : 600, color: isChecked ? '#92400e' : '#334155' }}>
                          {sight.name}
                        </div>
                        <div style={{ fontSize: '9.5px', color: '#64748b' }}>
                          {sight.location === 'Hilltop' ? '⛰️' : '🛕'} {sight.highlight}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: CUSTOMER DETAILS (MANUAL ENTRY) */}
      <div
        style={{
          background: '#f8fafc',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: '#0f172a',
            letterSpacing: '0.6px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <User size={15} color="#d97706" /> 3. Customer / Passenger Details
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
              Customer / Devotee Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Suresh Kumar Reddy"
              value={invoice.customerName || ''}
              onChange={(e) => handleChange('customerName', e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                marginTop: '4px',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                Mobile Number *
              </label>
              <div style={{ position: 'relative', marginTop: '4px' }}>
                <Phone size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '11px' }} />
                <input
                  type="tel"
                  inputMode="tel"
                  placeholder="e.g. +91 98480 22334"
                  value={invoice.customerMobile || ''}
                  onChange={(e) => handleChange('customerMobile', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 32px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                Email Address
              </label>
              <div style={{ position: 'relative', marginTop: '4px' }}>
                <Mail size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '11px' }} />
                <input
                  type="email"
                  inputMode="email"
                  placeholder="e.g. customer@gmail.com"
                  value={invoice.customerEmail || ''}
                  onChange={(e) => handleChange('customerEmail', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 30px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: VEHICLE & CHAUFFEUR DETAILS (PRESETS + MANUAL ENTRY) */}
      <div
        style={{
          background: '#f8fafc',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: '#2563eb',
            letterSpacing: '0.6px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Car size={15} /> 4. Vehicle Selection & Chauffeur Details
          </div>
          <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700, textTransform: 'none' }}>
            ✍️ Type any vehicle or driver
          </span>
        </div>

        {/* 4 Interactive Fleet Cards (Shown in Guided Mode) */}
        {entryMode === 'guided' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginBottom: '14px' }}>
            {CAR_TYPES.slice(0, 4).map((car) => {
              const isSelected = invoice.carType?.includes(car.shortName);
              return (
                <div
                  key={car.id}
                  onClick={() => selectCar(car)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    background: isSelected ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span
                      style={{
                        fontSize: '9.5px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        background: isSelected ? '#dbeafe' : '#f1f5f9',
                        color: isSelected ? '#1e40af' : '#475569',
                      }}
                    >
                      {car.capacity}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#059669' }}>
                      ₹{car.defaultPerKm}/km
                    </span>
                  </div>
                  <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                    {car.shortName}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Suggestion Chips for Car Types */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
            ⚡ Quick Model Suggestions (or type custom below):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {[
              { name: 'Swift Dzire (Sedan - 4+1)', rate: 14 },
              { name: 'Maruti Ertiga (MUV - 6+1)', rate: 19 },
              { name: 'Innova Crysta (MPV - 7+1)', rate: 23 },
              { name: 'Tempo Traveller (12-14 Seater)', rate: 28 },
              { name: 'Toyota Etios (Sedan 4+1)', rate: 14 },
              { name: 'Innova Hycross (Luxury 7+1)', rate: 26 },
              { name: 'Force Urbania (Luxury Minibus)', rate: 32 },
              { name: 'Custom AC Cab', rate: 18 },
            ].map((v, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  handleChange('carType', v.name);
                  if (v.rate && (!invoice.ratePerKm || invoice.ratePerKm === 14)) {
                    handleChange('ratePerKm', v.rate);
                  }
                }}
                style={{
                  fontSize: '11px',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: invoice.carType === v.name ? '1px solid #2563eb' : '1px solid #cbd5e1',
                  background: invoice.carType === v.name ? '#eff6ff' : '#ffffff',
                  color: invoice.carType === v.name ? '#1d4ed8' : '#334155',
                  fontWeight: invoice.carType === v.name ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>

        {/* DIRECT MANUAL ENTRY FOR VEHICLE & DRIVER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
              Vehicle Name & Model * (Manual Entry)
            </label>
            <input
              type="text"
              placeholder="e.g. Swift Dzire AC Sedan, Innova Crysta, Tempo Traveller 14 Seater, Toyota Etios..."
              value={invoice.carType || ''}
              onChange={(e) => handleChange('carType', e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13.5px',
                fontWeight: 600,
                marginTop: '4px',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                Vehicle Registration No.
              </label>
              <input
                type="text"
                placeholder="e.g. AP 03 BP 4589"
                value={invoice.vehicleNumber || ''}
                onChange={(e) => handleChange('vehicleNumber', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  fontFamily: "'JetBrains Mono', monospace",
                  textTransform: 'uppercase',
                  marginTop: '4px',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                Chauffeur / Driver Name
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Naidu"
                value={invoice.driverName || ''}
                onChange={(e) => handleChange('driverName', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  marginTop: '4px',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                Driver Mobile Number
              </label>
              <input
                type="tel"
                inputMode="tel"
                placeholder="e.g. +91 94401 55667"
                value={invoice.driverMobile || ''}
                onChange={(e) => handleChange('driverMobile', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  marginTop: '4px',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: BILLING METHOD & TARIFFS (MANUAL ENTRY) */}
      <div
        style={{
          background: '#f8fafc',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: '#059669',
            letterSpacing: '0.6px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={15} /> 5. Billing Calculation & Tariffs
          </div>
          <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700, textTransform: 'none' }}>
            KM / Fixed / Hourly / Both
          </span>
        </div>

        {/* 4-way Billing Model Switcher */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
            Select How You Want to Charge for this Trip:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '6px' }}>
            {[
              { id: 'km', label: '📏 Per KM Only', desc: 'KM × Rate' },
              { id: 'package', label: '💰 Fixed / Flat Rate', desc: 'Lumpsum Fare' },
              { id: 'hourly', label: '⏱️ Hourly Rental', desc: 'Hours × Rate' },
              { id: 'both', label: '🔄 KM + Hours', desc: 'KM + Extra Waiting' },
            ].map((m) => {
              const isSelected = billingModel === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleChange('billingModel', m.id)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #059669' : '1px solid #cbd5e1',
                    background: isSelected ? '#ecfdf5' : '#ffffff',
                    color: isSelected ? '#065f46' : '#334155',
                    fontWeight: isSelected ? 800 : 600,
                    fontSize: '12px',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <div>{m.label}</div>
                  <div style={{ fontSize: '10px', color: isSelected ? '#047857' : '#64748b', marginTop: '2px' }}>
                    {m.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* DYNAMIC TARIFF INPUTS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          {/* Flat Package Price (Shown prominently in package mode) */}
          {billingModel === 'package' && (
            <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '2px solid #059669', gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 800, color: '#065f46' }}>
                Fixed Package / Lumpsum Trip Fare (₹) *
              </label>
              <div style={{ position: 'relative', marginTop: '6px' }}>
                <span style={{ position: 'absolute', left: '12px', top: '9px', fontWeight: 800, fontSize: '16px', color: '#059669' }}>₹</span>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="e.g. 2500, 3800, 4500"
                  value={invoice.packageBasePrice || ''}
                  onChange={(e) => handleChange('packageBasePrice', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 30px',
                    borderRadius: '6px',
                    border: '1px solid #a7f3d0',
                    fontSize: '17px',
                    fontWeight: 800,
                    color: '#065f46',
                  }}
                />
              </div>
              <div style={{ fontSize: '11px', color: '#047857', marginTop: '4px' }}>
                Total agreed flat price for this tour (Tolls, parking and batta can be added separately below).
              </div>
            </div>
          )}

          {/* Per KM Price (Shown in km, both, or optional in package) */}
          {billingModel !== 'hourly' && (
            <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                Per Kilometer Price (₹ / km) *
              </label>
              <div style={{ position: 'relative', marginTop: '4px' }}>
                <span style={{ position: 'absolute', left: '10px', top: '8px', fontWeight: 700, color: '#10b981' }}>₹</span>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g. 14, 19, 23, 28"
                  value={invoice.ratePerKm || ''}
                  onChange={(e) => handleChange('ratePerKm', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px 8px 24px',
                    borderRadius: '6px',
                    border: '2px solid #10b981',
                    fontSize: '15px',
                    fontWeight: 800,
                    color: '#065f46',
                  }}
                />
              </div>
              <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '4px' }}>
                Swift: ₹14 • Ertiga: ₹19 • Crysta: ₹23 • TT: ₹28
              </div>
            </div>
          )}

          {/* KM Driven */}
          <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
              Total KM Driven {billingModel === 'km' || billingModel === 'both' ? '*' : '(For Info)'}
            </label>
            <div style={{ position: 'relative', marginTop: '4px' }}>
              <Gauge size={15} color="#64748b" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input
                type="number"
                inputMode="numeric"
                placeholder="e.g. 44, 380, 45, 135"
                value={invoice.totalKm || ''}
                onChange={(e) => handleChange('totalKm', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px 8px 30px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              />
            </div>
            <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '4px' }}>
              Displayed on customer bill & duty slip
            </div>
          </div>

          {/* Hours Used */}
          <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
              How Many Hours Used?
            </label>
            <div style={{ position: 'relative', marginTop: '4px' }}>
              <Clock size={15} color="#64748b" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input
                type="number"
                step="0.5"
                inputMode="decimal"
                placeholder="e.g. 6, 8, 12"
                value={invoice.hoursUsed || ''}
                onChange={(e) => handleChange('hoursUsed', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px 8px 30px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              />
            </div>
            <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '4px' }}>
              Duty time / waiting duration
            </div>
          </div>

          {/* Hourly Rate */}
          {(billingModel === 'hourly' || billingModel === 'both') && (
            <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                Hourly Rate (₹ / Hr, if extra)
              </label>
              <div style={{ position: 'relative', marginTop: '4px' }}>
                <span style={{ position: 'absolute', left: '10px', top: '8px', fontWeight: 700, color: '#64748b' }}>₹</span>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="e.g. 250, 450"
                  value={invoice.hourlyRate || ''}
                  onChange={(e) => handleChange('hourlyRate', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px 8px 24px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    fontWeight: 700,
                  }}
                />
              </div>
              <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '4px' }}>
                Leave 0 or empty to charge KM only
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 6: TOLLS, PARKING, BATTA & EXTRA CHARGES (MANUAL ENTRY) */}
      <div
        style={{
          background: '#f8fafc',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: '#64748b',
            letterSpacing: '0.6px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Receipt size={15} /> 6. Tolls, Parking, Driver Batta & Extra Fees
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>
              Toll & Ghat Entry (₹)
            </label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="e.g. 150"
              value={invoice.tollCharges || ''}
              onChange={(e) => handleChange('tollCharges', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                marginTop: '4px',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>
              Parking Fees (₹)
            </label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="e.g. 100"
              value={invoice.parkingCharges || ''}
              onChange={(e) => handleChange('parkingCharges', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                marginTop: '4px',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>
              Driver Batta (₹)
            </label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="e.g. 300"
              value={invoice.driverAllowance || ''}
              onChange={(e) => handleChange('driverAllowance', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                marginTop: '4px',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>
              Night Halt (₹)
            </label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="e.g. 500"
              value={invoice.nightHaltCharges || ''}
              onChange={(e) => handleChange('nightHaltCharges', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                marginTop: '4px',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>
              Other / Permit Tax (₹)
            </label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="e.g. 200"
              value={invoice.otherCharges || ''}
              onChange={(e) => handleChange('otherCharges', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                marginTop: '4px',
              }}
            />
          </div>
        </div>

        {/* Other Charges Description (if any other fee is entered) */}
        {Number(invoice.otherCharges) > 0 && (
          <div style={{ marginTop: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>
              Description for Other Charges:
            </label>
            <input
              type="text"
              placeholder="e.g. Tamil Nadu State Border Permit, Special Hill Cleaning Fee"
              value={invoice.otherChargesDesc || ''}
              onChange={(e) => handleChange('otherChargesDesc', e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '12.5px',
                marginTop: '3px',
              }}
            />
          </div>
        )}

        {/* Advance, Discount & Payment Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed #cbd5e1' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>
              Special Discount (₹)
            </label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="e.g. 100"
              value={invoice.discount || ''}
              onChange={(e) => handleChange('discount', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                marginTop: '4px',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#059669' }}>
              Advance Paid (₹) *
            </label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="e.g. 500, 1000"
              value={invoice.advancePaid || ''}
              onChange={(e) => handleChange('advancePaid', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '2px solid #059669',
                fontSize: '14px',
                fontWeight: 700,
                color: '#065f46',
                marginTop: '4px',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>
              Payment Status
            </label>
            <select
              value={invoice.paymentStatus}
              onChange={(e) => handleChange('paymentStatus', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '12.5px',
                fontWeight: 700,
                marginTop: '4px',
              }}
            >
              <option value="Paid">Paid (Full)</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Pending">Pending / Unpaid</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>
              Payment Mode
            </label>
            <select
              value={invoice.paymentMode}
              onChange={(e) => handleChange('paymentMode', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '12.5px',
                marginTop: '4px',
              }}
            >
              <option value="UPI (GPay / PhonePe)">UPI (GPay / PhonePe / Paytm)</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer (NEFT / IMPS)</option>
              <option value="Card">Card</option>
            </select>
          </div>
        </div>

        {/* Special Notes / Terms Textarea */}
        <div style={{ marginTop: '12px' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>
            Trip Notes / Terms (Shown on Bill):
          </label>
          <textarea
            rows={2}
            value={invoice.specialNotes || ''}
            onChange={(e) => handleChange('specialNotes', e.target.value)}
            placeholder="e.g. Clean Sanitized AC Cab • Experienced Ghat Driver • 24/7 Doorstep Pickup"
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '12px',
              marginTop: '4px',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
        </div>
      </div>
    </div>
  );
}

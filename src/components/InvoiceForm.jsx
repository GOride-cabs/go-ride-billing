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
  ChevronUp
} from 'lucide-react';
import { CAR_TYPES, OFFICIAL_TRIP_PACKAGES, SIGHTSEEING_ATTRACTIONS, generateInvoiceNumber, getTodayDateString } from '../data/defaults';

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

  const handleCarSelectDropdown = (e) => {
    const val = e.target.value;
    const found = CAR_TYPES.find((c) => c.name === val || c.id === val);
    if (found) {
      selectCar(found);
    } else {
      handleChange('carType', val);
    }
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

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
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
          paddingBottom: '16px',
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
            Owner Booking & Billing Desk
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b' }}>
            N Viswanadham • Go Ride Tirupati Cabs
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
            <Sparkles size={13} color="#d97706" /> Sample Data
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

      {/* SECTION 1: TRIP / PACKAGE SELECTOR */}
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
            <Compass size={15} /> 1. Select Trip Package Offered
          </div>
          <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700, textTransform: 'none' }}>
            ⚡ Auto-fills Route & KM
          </span>
        </div>

        <div>
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
            }}
          >
            {OFFICIAL_TRIP_PACKAGES.map((pkg) => (
              <option key={pkg.id} value={pkg.name}>
                {pkg.name} — [{pkg.badge} • {pkg.distanceKm} KM]
              </option>
            ))}
          </select>
        </div>

        {/* Quick Click Badges for All 9 Official Packages */}
        <div style={{ marginTop: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
            ⚡ 1-Click Popular Tour Packages (Auto-fills distance & destinations):
          </div>
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
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

      {/* SECTION 2: CUSTOMER DETAILS */}
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
          <User size={15} color="#d97706" /> 2. Customer Details
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
              Customer Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Suresh Kumar Reddy"
              value={invoice.customerName}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
                  value={invoice.customerMobile}
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
                  placeholder="e.g. customer@gmail.com"
                  value={invoice.customerEmail}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                Pickup Location
              </label>
              <input
                type="text"
                placeholder="e.g. Tirupati Railway Station"
                value={invoice.pickupLocation}
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
                Drop Location
              </label>
              <input
                type="text"
                placeholder="e.g. Tirumala Hill - Balaji Darshan"
                value={invoice.dropLocation}
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
      </div>

      {/* SECTION 3: OFFICIAL FLEET & PER-KM TARIFF */}
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
            <Car size={15} /> 3. Vehicle Selection & Official Tariffs
          </div>
          <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700, textTransform: 'none' }}>
            ✓ Fixed Per-KM Pricing
          </span>
        </div>

        {/* 4 Interactive Fleet Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '14px' }}>
          {CAR_TYPES.slice(0, 4).map((car) => {
            const isSelected = invoice.carType.includes(car.shortName);
            return (
              <div
                key={car.id}
                onClick={() => selectCar(car)}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: isSelected ? '#eff6ff' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
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
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                      {car.shortName}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#059669' }}>
                      ₹{car.defaultPerKm}
                      <span style={{ fontSize: '10px', fontWeight: 600, color: '#64748b' }}>/km</span>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '6px', lineHeight: 1.3 }}>
                  {car.description}
                </div>

                <div style={{ fontSize: '10px', color: '#d97706', fontWeight: 600, marginTop: '4px' }}>
                  {car.highlights}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
              Selected Car Model *
            </label>
            <select
              value={invoice.carType}
              onChange={handleCarSelectDropdown}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '2px solid #3b82f6',
                fontSize: '13px',
                marginTop: '4px',
                background: '#ffffff',
                fontWeight: 700,
                color: '#0f172a',
              }}
            >
              {CAR_TYPES.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.shortName} ({c.capacity}) — Outstation Tariff: Rs. {c.defaultPerKm} / km {c.badge ? `[${c.badge}]` : ''}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                Vehicle Number
              </label>
              <input
                type="text"
                placeholder="e.g. AP 03 BP 4589"
                value={invoice.vehicleNumber}
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
                Driver Name
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Naidu"
                value={invoice.driverName}
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
          </div>
        </div>
      </div>

      {/* SECTION 4: HOURS & PER KILOMETER TARIFF */}
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
            gap: '6px',
          }}
        >
          <Clock size={15} /> 4. Distance (KM) & Hours Used
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {/* Per KM Price */}
          <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
              Per Kilometer Price (Rs. / km) *
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
              Swift Dzire: ₹14 • Ertiga: ₹19 • Innova Crysta: ₹23 • TT: ₹28
            </div>
          </div>

          {/* KM Driven */}
          <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
              Total KM Driven *
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
                placeholder="e.g. 6 or 8"
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
          </div>

          {/* Hourly Rate */}
          <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
              Hourly Rate (₹ / Hr, if extra)
            </label>
            <div style={{ position: 'relative', marginTop: '4px' }}>
              <span style={{ position: 'absolute', left: '10px', top: '8px', fontWeight: 700, color: '#64748b' }}>₹</span>
              <input
                type="number"
                inputMode="numeric"
                placeholder="e.g. 450"
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
          </div>
        </div>
      </div>

      {/* SECTION 5: TOLLS, ADVANCE & PAYMENT */}
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
          <Receipt size={15} /> 5. Tolls, Parking, Advance & Balance
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>
              Toll & Parking (₹)
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
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#059669' }}>
              Advance Paid (₹)
            </label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="e.g. 500"
              value={invoice.advancePaid || ''}
              onChange={(e) => handleChange('advancePaid', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                fontWeight: 700,
                marginTop: '4px',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
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
                fontSize: '12px',
                marginTop: '4px',
              }}
            >
              <option value="Paid">Paid</option>
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
                fontSize: '12px',
                marginTop: '4px',
              }}
            >
              <option value="UPI (GPay / PhonePe)">UPI (GPay / PhonePe / Paytm)</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

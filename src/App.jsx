import React, { useState, useEffect } from 'react';
import HeaderNav from './components/HeaderNav';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import CompanySettingsModal from './components/CompanySettingsModal';
import HistoryDrawer from './components/HistoryDrawer';
import {
  DEFAULT_COMPANY,
  INITIAL_INVOICE_DATA,
  generateInvoiceNumber,
  getTodayDateString
} from './data/defaults';
import { downloadInvoicePdf } from './utils/pdfExport';
import { computeInvoice } from './utils/calculations';
import { formatINR } from './utils/numberToWords';
import { Check, AlertTriangle, Download, MessageCircle, Printer, Eye, Edit3 } from 'lucide-react';

export default function App() {
  // Load saved company profile or default with genuine details
  const [company, setCompany] = useState(() => {
    try {
      const saved = localStorage.getItem('goride_company_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_COMPANY,
          ...parsed,
          proprietor: parsed.proprietor || DEFAULT_COMPANY.proprietor,
          ownerContact: parsed.ownerContact || DEFAULT_COMPANY.ownerContact,
          email: parsed.email || DEFAULT_COMPANY.email,
          website: parsed.website || DEFAULT_COMPANY.website,
          gstin: '', // Purged completely
        };
      }
      return DEFAULT_COMPANY;
    } catch {
      return DEFAULT_COMPANY;
    }
  });

  // Load active invoice draft
  const [invoice, setInvoice] = useState(() => {
    try {
      const draft = localStorage.getItem('goride_active_draft');
      return draft ? JSON.parse(draft) : INITIAL_INVOICE_DATA;
    } catch {
      return INITIAL_INVOICE_DATA;
    }
  });

  // Saved Invoices list
  const [savedInvoices, setSavedInvoices] = useState(() => {
    try {
      const saved = localStorage.getItem('goride_invoices');
      return saved ? JSON.parse(saved) : [INITIAL_INVOICE_DATA];
    } catch {
      return [INITIAL_INVOICE_DATA];
    }
  });

  // Automatically select view mode based on screen width
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return 'form'; // On phone/tablet, show full-screen form first
    }
    return 'split'; // Desktop gets side-by-side
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Auto-save active draft to browser localStorage
  useEffect(() => {
    try {
      localStorage.setItem('goride_active_draft', JSON.stringify(invoice));
    } catch (e) {
      console.error('Draft save error:', e);
    }
  }, [invoice]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    showToast('Creating high-resolution A4 PDF...');
    try {
      const customerClean = (invoice.customerName || 'Customer').replace(/\s+/g, '_');
      const fileName = `GoRide-Trip-Bill-${invoice.invoiceNumber || 'Bill'}-${customerClean}.pdf`;
      const targetElementId = document.getElementById('invoice-printable') ? 'invoice-printable' : 'invoice-printable-offscreen';
      await downloadInvoicePdf(targetElementId, fileName);
      showToast('PDF downloaded successfully!');
    } catch (err) {
      console.error('Error generating PDF:', err);
      showToast('Opening print dialog for PDF...', 'error');
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    if (!invoice.customerMobile) {
      showToast('Please enter customer mobile number first!', 'error');
      return;
    }

    const calc = computeInvoice(invoice);
    const phone = invoice.customerMobile.replace(/[^0-9]/g, '');

    const isRound = invoice.tripType === 'round_trip';
    let itineraryLines = '';
    if (isRound && invoice.roundTripDays?.length > 0) {
      const valid = invoice.roundTripDays.filter((d) => d.placesVisited || d.date);
      if (valid.length > 0) {
        itineraryLines = '\n' + valid.map((d) => `• *Day-${d.dayNumber}* (${d.date || 'Scheduled'}): ${d.placesVisited || 'Places visited'}`).join('\n');
      }
    }

    const text = `*🚕 GORIDE TIRUPATI CABS - TRIP BILL*
---------------------------------------
*Invoice No:* ${invoice.invoiceNumber}
*Customer:* ${invoice.customerName || 'Devotee / Passenger'}
*Vehicle:* ${invoice.carType} (${invoice.vehicleNumber || 'Cab'})
*Trip Type:* ${isRound ? `🔄 Round Trip (${invoice.roundTripDays?.length || 2} Days)` : '➡️ One-Way Drop'}
*Route:* ${invoice.pickupLocation} ➡️ ${invoice.dropLocation}${itineraryLines ? `\n\n*📅 Day-Wise Itinerary:*${itineraryLines}` : ''}
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

  const handleSaveInvoice = () => {
    try {
      const existsIndex = savedInvoices.findIndex(
        (inv) => inv.invoiceNumber === invoice.invoiceNumber
      );

      let updated;
      if (existsIndex >= 0) {
        updated = [...savedInvoices];
        updated[existsIndex] = invoice;
      } else {
        updated = [invoice, ...savedInvoices];
      }

      setSavedInvoices(updated);
      localStorage.setItem('goride_invoices', JSON.stringify(updated));
      showToast(`Invoice ${invoice.invoiceNumber} saved!`);
    } catch {
      showToast('Failed to save invoice.', 'error');
    }
  };

  const handleReset = () => {
    const newInv = {
      ...INITIAL_INVOICE_DATA,
      invoiceNumber: generateInvoiceNumber(),
      invoiceDate: getTodayDateString(),
      pickupDateTime: '',
      tripPackageName: 'Custom / Local Trip Booking',
      tripType: 'one_way',
      roundTripDays: [
        { dayNumber: 1, date: getTodayDateString(), placesVisited: '' },
        { dayNumber: 2, date: '', placesVisited: '' },
      ],
      selectedSights: [],
      customerName: '',
      customerMobile: '',
      customerEmail: '',
      pickupLocation: 'Tirupati',
      dropLocation: 'Tirumala Hill',
      carType: 'Swift Dzire (Sedan - 4 + 1 Seater)',
      vehicleNumber: '',
      driverName: '',
      driverMobile: '',
      billingModel: 'km',
      packageBasePrice: 0,
      totalKm: 0,
      ratePerKm: 14,
      hoursUsed: 0,
      hourlyRate: 250,
      tollCharges: 0,
      parkingCharges: 0,
      driverAllowance: 0,
      nightHaltCharges: 0,
      otherCharges: 0,
      otherChargesDesc: '',
      advancePaid: 0,
      discount: 0,
      enableGst: false,
      gstRate: 0,
      paymentStatus: 'Pending',
      paymentMode: 'Cash',
      specialNotes: 'Clean Sanitized AC Cab • Ghat Experienced Driver • 24/7 Tirupati Doorstep Pickup',
    };
    setInvoice(newInv);
    showToast('Cleaned form for new invoice.');
  };

  const handleLoadInvoice = (loaded) => {
    setInvoice(loaded);
    setIsHistoryOpen(false);
    showToast(`Loaded invoice ${loaded.invoiceNumber}`);
  };

  const handleDeleteInvoice = (invNum) => {
    if (confirm(`Delete invoice ${invNum}?`)) {
      const updated = savedInvoices.filter((inv) => inv.invoiceNumber !== invNum);
      setSavedInvoices(updated);
      localStorage.setItem('goride_invoices', JSON.stringify(updated));
      showToast(`Deleted invoice ${invNum}`);
    }
  };

  const currentCalc = computeInvoice(invoice);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', paddingBottom: '70px' }}>
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            background: toast.type === 'error' ? '#ef4444' : '#0f172a',
            color: '#ffffff',
            padding: '12px 18px',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            fontWeight: 700,
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {toast.type === 'error' ? <AlertTriangle size={16} /> : <Check size={16} color="#10b981" />}
          {toast.message}
        </div>
      )}

      {/* Top Navbar */}
      <HeaderNav
        invoice={invoice}
        company={company}
        onDownloadPdf={handleDownloadPdf}
        onPrint={handlePrint}
        onSave={handleSaveInvoice}
        onReset={handleReset}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        savedCount={savedInvoices.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isGeneratingPdf={isGeneratingPdf}
      />

      {/* MOBILE TOP STEP SWITCHER (Visible on phones & tablets) */}
      <div
        className="no-print"
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '8px 16px',
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
        }}
      >
        <button
          type="button"
          onClick={() => setViewMode('form')}
          style={{
            flex: 1,
            maxWidth: '220px',
            padding: '10px 14px',
            borderRadius: '8px',
            border: viewMode === 'form' ? '2px solid #d97706' : '1px solid #cbd5e1',
            background: viewMode === 'form' ? '#fef3c7' : '#ffffff',
            color: viewMode === 'form' ? '#92400e' : '#475569',
            fontWeight: 800,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          <Edit3 size={15} color={viewMode === 'form' ? '#d97706' : '#64748b'} />
          1. Fill Details
        </button>

        <button
          type="button"
          onClick={() => setViewMode('preview')}
          style={{
            flex: 1,
            maxWidth: '220px',
            padding: '10px 14px',
            borderRadius: '8px',
            border: viewMode === 'preview' ? '2px solid #2563eb' : '1px solid #cbd5e1',
            background: viewMode === 'preview' ? '#eff6ff' : '#ffffff',
            color: viewMode === 'preview' ? '#1d4ed8' : '#475569',
            fontWeight: 800,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          <Eye size={15} color={viewMode === 'preview' ? '#2563eb' : '#64748b'} />
          2. View Bill
          <span
            style={{
              fontSize: '11px',
              padding: '1px 6px',
              borderRadius: '9999px',
              background: '#10b981',
              color: '#ffffff',
              fontWeight: 800,
              marginLeft: '4px',
            }}
          >
            {formatINR(currentCalc.grandTotal)}
          </span>
        </button>
      </div>

      {/* Main Workspace */}
      <main style={{ flex: 1, padding: '12px 10px', maxWidth: '1440px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              viewMode === 'split' ? 'minmax(400px, 460px) minmax(500px, 1fr)' : '100%',
            gap: '20px',
            alignItems: 'start',
          }}
        >
          {/* Form Column */}
          {(viewMode === 'split' || viewMode === 'form') && (
            <div className="no-print" style={{ width: '100%' }}>
              <InvoiceForm
                invoice={invoice}
                setInvoice={setInvoice}
                onReset={handleReset}
                onDownloadPdf={handleDownloadPdf}
                onPrint={handlePrint}
                isGeneratingPdf={isGeneratingPdf}
              />
            </div>
          )}

          {/* Live Preview Column (Visible in Preview or Split mode) */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div
              style={{
                position: viewMode === 'split' ? 'sticky' : 'static',
                top: '70px',
                width: '100%',
              }}
            >
              <div
                className="no-print"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                  padding: '6px 10px',
                  background: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Eye size={15} color="#2563eb" />
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
                    Printable Bill Preview
                  </span>
                  <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>
                    (Single-Page A4)
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    style={{
                      background: '#d97706',
                      color: '#ffffff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Download size={13} />
                    Download PDF
                  </button>
                </div>
              </div>

              {/* Scrollable on small screens so bill is never clipped */}
              <div className="invoice-mobile-scroll">
                <InvoicePreview invoice={invoice} company={company} id="invoice-printable" />
              </div>
            </div>
          )}
        </div>

        {/* ALWAYS PRESENT OFF-SCREEN PRINTABLE ELEMENT (Ensures 1-Tap PDF works from the Form tab) */}
        {viewMode === 'form' && (
          <div
            style={{
              position: 'fixed',
              left: '-9999px',
              top: 0,
              width: '780px',
              pointerEvents: 'none',
              opacity: 0,
              zIndex: -1,
            }}
            aria-hidden="true"
          >
            <InvoicePreview invoice={invoice} company={company} id="invoice-printable-offscreen" />
          </div>
        )}
      </main>

      {/* PERSISTENT MOBILE BOTTOM ACTION BAR */}
      <div
        className="no-print"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#ffffff',
          borderTop: '1px solid #cbd5e1',
          padding: '8px 12px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 999,
          boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.08)',
        }}
      >
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          style={{
            flex: 2,
            background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '12px 14px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 2px 6px rgba(217, 119, 6, 0.35)',
            cursor: isGeneratingPdf ? 'wait' : 'pointer',
          }}
        >
          <Download size={17} />
          <span>{isGeneratingPdf ? 'Generating...' : 'Download PDF (1-Tap)'}</span>
        </button>

        <button
          type="button"
          onClick={handleWhatsAppShare}
          style={{
            flex: 1,
            background: '#25d366',
            color: '#ffffff',
            border: 'none',
            padding: '12px 10px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          <MessageCircle size={17} />
          <span>WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          style={{
            background: '#0f172a',
            color: '#ffffff',
            border: 'none',
            padding: '12px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          title="Print Bill"
        >
          <Printer size={16} />
        </button>
      </div>

      {/* Settings Modal */}
      <CompanySettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        company={company}
        setCompany={setCompany}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedInvoices={savedInvoices}
        onLoadInvoice={handleLoadInvoice}
        onDeleteInvoice={handleDeleteInvoice}
      />
    </div>
  );
}

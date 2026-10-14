import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share2, PlusSquare, CheckCircle2, Sparkles } from 'lucide-react';

export default function InstallPwa() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode (installed)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Check if previously dismissed in this session
    const dismissed = sessionStorage.getItem('goride_pwa_dismissed');
    if (dismissed) {
      setIsDismissed(true);
    }

    // Detect iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    const isSafari = /safari/.test(ua) && !/crios|fxios|chrome/.test(ua);
    if (isIosDevice && isSafari && !isStandalone) {
      setIsIos(true);
      setIsInstallable(true);
    }

    // Listen for beforeinstallprompt event (Android Chrome, Windows, Chrome, Edge)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosModal(true);
      return;
    }

    if (!deferredPrompt) {
      // If prompt isn't ready, show tip or alert
      alert('To install GoRide App:\n• On Chrome/Edge: Click the install icon (🖥️ or ➕) in the browser address bar.\n• On Mobile: Tap browser menu (⋮) and select "Add to Home Screen" or "Install App".');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('goride_pwa_dismissed', 'true');
  };

  // If already installed, hide completely
  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* 1. Sleek Floating / Bottom Install Card */}
      {!isDismissed && (
        <div
          className="no-print"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 9999,
            maxWidth: '380px',
            width: 'calc(100vw - 40px)',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            borderRadius: '16px',
            padding: '14px 16px',
            boxShadow: '0 16px 36px -6px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(245, 158, 11, 0.3)',
            animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            {/* App Icon */}
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#020617',
                border: '1.5px solid #f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
              }}
            >
              <img
                src="/icons/icon-192.png"
                alt="GoRide"
                style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#ffffff',
                    letterSpacing: '-0.2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <span>Install GoRide App</span>
                  <Sparkles size={13} color="#f59e0b" />
                </span>
                <button
                  type="button"
                  onClick={handleDismiss}
                  title="Dismiss"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '2px',
                    lineHeight: 1,
                  }}
                >
                  <X size={15} />
                </button>
              </div>

              <p
                style={{
                  fontSize: '11px',
                  color: '#cbd5e1',
                  margin: '3px 0 10px 0',
                  lineHeight: 1.35,
                }}
              >
                Add GoRide Billing to your phone or desktop for instant 1-tap taxi invoicing & offline receipts!
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleInstallClick}
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    letterSpacing: '0.3px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)',
                  }}
                >
                  <Download size={13} />
                  <span>Install App</span>
                </button>

                <button
                  type="button"
                  onClick={handleDismiss}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#94a3b8',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. iOS Safari Installation Instructions Modal */}
      {showIosModal && (
        <div
          className="no-print"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowIosModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              maxWidth: '360px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              textAlign: 'center',
              color: '#0f172a',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: '#0f172a',
                border: '2px solid #f59e0b',
                margin: '0 auto 12px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Smartphone size={28} color="#f59e0b" />
            </div>

            <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '0 0 6px 0' }}>
              Install on iPhone / iPad
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px 0' }}>
              Follow these 2 quick steps to add GoRide to your Home Screen:
            </p>

            <div style={{ textAlign: 'left', background: '#f8fafc', borderRadius: '12px', padding: '12px 14px', marginBottom: '16px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ background: '#e2e8f0', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '11px' }}>1</span>
                <span>Tap the <strong>Share</strong> button <Share2 size={13} style={{ display: 'inline', verticalAlign: 'middle', color: '#2563eb' }} /> in Safari toolbar</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: '#e2e8f0', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '11px' }}>2</span>
                <span>Select <strong>"Add to Home Screen"</strong> <PlusSquare size={13} style={{ display: 'inline', verticalAlign: 'middle' }} /></span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIosModal(false)}
              style={{
                width: '100%',
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '10px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// 3. Compact Navbar Button component to export separately
export function NavbarInstallButton() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  if (isInstalled) return null;

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert('To install GoRide App:\n• Android/Chrome: Tap browser menu (⋮) -> "Add to Home screen"\n• iPhone: Tap Share -> "Add to Home Screen"\n• Desktop: Click the install icon in your address bar.');
    }
  };

  return (
    <button
      type="button"
      onClick={handleInstall}
      title="Download & Install GoRide App"
      style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: '#0f172a',
        border: 'none',
        padding: '7px 11px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: 800,
        letterSpacing: '0.2px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(245, 158, 11, 0.25)',
      }}
    >
      <Download size={13} />
      <span>Install App</span>
    </button>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  Share2,
  PlusSquare,
  CheckCircle2,
  Lock,
  Unlock,
  Zap,
  WifiOff
} from 'lucide-react';

export function checkIsPwaActive() {
  if (typeof window === 'undefined') return false;

  // 1. URL parameter from manifest start_url (?mode=pwa)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('mode') === 'pwa' || urlParams.get('pwa') === '1' || urlParams.get('source') === 'pwa') {
    return true;
  }

  // 2. Standard CSS display-mode
  const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
  const isFullscreenMedia = window.matchMedia('(display-mode: fullscreen)').matches;
  const isMinimalMedia = window.matchMedia('(display-mode: minimal-ui)').matches;

  // 3. iOS Safari standalone
  const isIosStandalone = window.navigator.standalone === true;

  // 4. Android intent referrer
  const isReferrerPwa = document.referrer && document.referrer.includes('android-app://');

  // 5. Local bypass storage if unlocked
  const sessionUnlocked = sessionStorage.getItem('goride_browser_bypass') === 'true';

  return isStandaloneMedia || isFullscreenMedia || isMinimalMedia || isIosStandalone || isReferrerPwa || sessionUnlocked;
}

export default function PwaInstallGate({ children }) {
  const [isPwa, setIsPwa] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [deviceType, setDeviceType] = useState('android');
  const [installSuccess, setInstallSuccess] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [bypassed, setBypassed] = useState(false);
  const [showAdminBypassModal, setShowAdminBypassModal] = useState(false);
  const [bypassPin, setBypassPin] = useState('');
  const [bypassError, setBypassError] = useState('');

  useEffect(() => {
    // 1. Check if already active
    if (checkIsPwaActive()) {
      setIsPwa(true);
      return;
    }

    // 2. Identify device
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    const isMobile = /android|iphone|ipad|ipod|mobile/.test(ua);

    if (isIosDevice) {
      setDeviceType('ios');
    } else if (isMobile) {
      setDeviceType('android');
    } else {
      setDeviceType('desktop');
    }

    // 3. Capture native install prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 4. Listen for installation complete
    const handleAppInstalled = () => {
      setInstallSuccess(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deviceType === 'ios') {
      alert('To install on iPhone/iPad:\n\n1. Tap the Share button at the bottom of Safari (square with arrow up)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" in top right corner\n4. Open GoRide Bill from your Home Screen!');
      return;
    }

    if (!deferredPrompt) {
      alert('To add GoRide Bill to your Home Screen:\n\n• Android: Tap Chrome menu (3 dots in top right) -> "Add to Home screen" or "Install app"\n• Desktop: Click the Install icon in your browser address bar');
      return;
    }

    try {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstallSuccess(true);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.warn('Install prompt error:', err);
    }
  };

  const handleLogoClick = () => {
    const next = logoClicks + 1;
    setLogoClicks(next);
    if (next >= 5) {
      setBypassed(true);
      sessionStorage.setItem('goride_browser_bypass', 'true');
    }
  };

  const handleBypassSubmit = (e) => {
    e.preventDefault();
    if (bypassPin.trim().toLowerCase() === 'goride' || bypassPin.trim() === '85009') {
      setBypassed(true);
      sessionStorage.setItem('goride_browser_bypass', 'true');
      setShowAdminBypassModal(false);
    } else {
      setBypassError('Invalid access code. Please add to home screen.');
    }
  };

  if (isPwa || bypassed) {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #090d16 0%, #0f172a 50%, #1e1b4b 100%)',
        color: '#ffffff',
        fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        boxSizing: 'border-box',
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      {/* Background Ambient Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0) 70%)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          maxWidth: '460px',
          width: '100%',
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: '24px',
          padding: '32px 24px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(245, 158, 11, 0.12)',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* App Icon / Logo */}
        <div
          onClick={handleLogoClick}
          title="GoRide Tirupati Cabs"
          style={{
            width: '84px',
            height: '84px',
            margin: '0 auto 18px auto',
            borderRadius: '22px',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '2px solid #f59e0b',
            padding: '4px',
            boxShadow: '0 12px 28px rgba(245, 158, 11, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <img
            src="/icons/icon-192.png"
            alt="GoRide Icon"
            style={{ width: '100%', height: '100%', borderRadius: '18px', objectFit: 'contain' }}
            onError={(e) => { e.target.src = '/favicon.svg'; }}
          />
        </div>

        {/* Lock Pill Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(245, 158, 11, 0.14)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            color: '#fbbf24',
            padding: '5px 14px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '14px'
          }}
        >
          <Lock size={12} />
          <span>Home Screen App Required</span>
        </div>

        <h1
          style={{
            fontSize: '24px',
            fontWeight: 900,
            margin: '0 0 8px 0',
            color: '#ffffff'
          }}
        >
          Install GoRide App
        </h1>

        <p
          style={{
            fontSize: '13px',
            color: '#94a3b8',
            lineHeight: 1.55,
            margin: '0 0 24px 0'
          }}
        >
          To generate bills, calculate fares, and manage receipts, you must <strong>add this app to your device Home Screen</strong> first.
        </p>

        {installSuccess ? (
          <div
            style={{
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              borderRadius: '16px',
              padding: '18px',
              marginBottom: '20px',
              color: '#86efac'
            }}
          >
            <CheckCircle2 size={36} color="#22c55e" style={{ margin: '0 auto 8px auto' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 4px 0', color: '#ffffff' }}>
              App Installed!
            </h3>
            <p style={{ fontSize: '12px', margin: 0, color: '#bbf7d0', lineHeight: 1.4 }}>
              Close this browser tab and tap the <strong>GoRide Bill</strong> icon on your Home Screen to unlock and start billing!
            </p>
          </div>
        ) : (
          <>
            {/* Primary Action Button */}
            <button
              type="button"
              onClick={handleInstallClick}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#0f172a',
                border: 'none',
                borderRadius: '14px',
                padding: '14px 20px',
                fontSize: '14px',
                fontWeight: 800,
                letterSpacing: '0.3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 8px 24px rgba(245, 158, 11, 0.35)',
                marginBottom: '20px'
              }}
            >
              <Download size={18} strokeWidth={2.5} />
              <span>{deviceType === 'ios' ? 'How to Add to Home Screen' : 'Add to Home Screen / Install App'}</span>
            </button>

            {/* Platform Specific Step Guide */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '16px',
                textAlign: 'left',
                marginBottom: '20px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  fontWeight: 800,
                  color: '#fbbf24',
                  marginBottom: '12px',
                  textTransform: 'uppercase'
                }}
              >
                <Smartphone size={15} />
                <span>
                  {deviceType === 'ios'
                    ? 'Steps for iPhone / iPad'
                    : deviceType === 'android'
                    ? 'Steps for Android (Chrome)'
                    : 'Steps for Desktop PC / Mac'}
                </span>
              </div>

              {deviceType === 'ios' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: '#cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ background: '#f59e0b', color: '#0f172a', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', flexShrink: 0 }}>1</span>
                    <span>Tap the <strong>Share</strong> button <Share2 size={13} color="#60a5fa" style={{ display: 'inline', verticalAlign: 'middle' }} /> in Safari toolbar.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ background: '#f59e0b', color: '#0f172a', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', flexShrink: 0 }}>2</span>
                    <span>Select <strong>Add to Home Screen</strong> <PlusSquare size={13} style={{ display: 'inline', verticalAlign: 'middle' }} />.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ background: '#f59e0b', color: '#0f172a', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', flexShrink: 0 }}>3</span>
                    <span>Tap <strong>Add</strong>, then launch <strong>GoRide Bill</strong> from your Home Screen!</span>
                  </div>
                </div>
              ) : deviceType === 'android' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: '#cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ background: '#f59e0b', color: '#0f172a', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', flexShrink: 0 }}>1</span>
                    <span>Tap the yellow <strong>Add to Home Screen</strong> button above.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ background: '#f59e0b', color: '#0f172a', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', flexShrink: 0 }}>2</span>
                    <span>Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ background: '#f59e0b', color: '#0f172a', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', flexShrink: 0 }}>3</span>
                    <span>Launch <strong>GoRide Bill</strong> from your phone Home Screen!</span>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: '#cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ background: '#f59e0b', color: '#0f172a', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', flexShrink: 0 }}>1</span>
                    <span>Click <strong>Install App</strong> above or the install icon in your browser address bar.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ background: '#f59e0b', color: '#0f172a', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', flexShrink: 0 }}>2</span>
                    <span>Confirm install. GoRide will launch as an independent desktop app!</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Benefits Badges */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            marginBottom: '18px'
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '10px',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              color: '#94a3b8',
              textAlign: 'left'
            }}
          >
            <Zap size={14} color="#f59e0b" style={{ flexShrink: 0 }} />
            <span>Instant 1-Tap Launch</span>
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '10px',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              color: '#94a3b8',
              textAlign: 'left'
            }}
          >
            <WifiOff size={14} color="#38bdf8" style={{ flexShrink: 0 }} />
            <span>Works 100% Offline</span>
          </div>
        </div>

        {/* Footer info & Admin bypass link */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            GoRide Tirupati Cabs © 2026
          </span>
          <button
            type="button"
            onClick={() => setShowAdminBypassModal(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              fontSize: '11px',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '4px'
            }}
          >
            Admin / Preview Mode
          </button>
        </div>
      </div>

      {/* Admin Bypass PIN Modal */}
      {showAdminBypassModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowAdminBypassModal(false)}
        >
          <div
            style={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '18px',
              padding: '24px',
              maxWidth: '340px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid #f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}
            >
              <Unlock size={22} color="#f59e0b" />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px 0', color: '#ffffff' }}>
              Admin / Preview Access
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px 0' }}>
              Enter admin passcode to unlock browser preview mode:
            </p>
            <form onSubmit={handleBypassSubmit}>
              <input
                type="password"
                placeholder="Enter passcode (goride)"
                value={bypassPin}
                onChange={(e) => { setBypassPin(e.target.value); setBypassError(''); }}
                autoFocus
                style={{
                  width: '100%',
                  background: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#ffffff',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                  marginBottom: '10px',
                  outline: 'none'
                }}
              />
              {bypassError && (
                <div style={{ color: '#f87171', fontSize: '11px', marginBottom: '10px' }}>
                  {bypassError}
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: '#f59e0b',
                    color: '#0f172a',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px',
                    fontWeight: 800,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Unlock Preview
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminBypassModal(false)}
                  style={{
                    background: '#334155',
                    color: '#94a3b8',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

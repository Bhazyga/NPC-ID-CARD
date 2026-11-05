import React, { useState, useEffect } from 'react';
import PublicProfileView from './components/PublicProfileView';
import BarcodeGeneratorStudio from './components/BarcodeGeneratorStudio';
import { EXECUTIVES, COMPANY_INFO } from './utils/profileState';

const QR_STORAGE_KEY = 'npc_qr_logo_config_v4';

function resolveRouteFromLocation() {
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
  const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '');

  if (path.endsWith('/director') || hash === 'director') return '/director';
  if (path.endsWith('/cfo') || hash === 'cfo') return '/cfo';
  if (path.endsWith('/ceo') || hash === 'ceo') return '/ceo';
  if (path.endsWith('/generator') || hash === 'generator') return '/generator';

  const params = new URLSearchParams(window.location.search);
  const roleParam = (params.get('role') || params.get('profile') || '').toLowerCase();
  if (roleParam === 'director') return '/director';
  if (roleParam === 'cfo') return '/cfo';
  if (roleParam === 'generator') return '/generator';

  // Default langsung ke kartu nama CEO jika dibuka di root (/)
  return '/ceo';
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(resolveRouteFromLocation);

  const [qrConfig, setQrConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(QR_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      logoUrl: COMPANY_INFO.logoUrl,
      showLogo: true,
      logoSizeRatio: 0.23,
      dotStyle: 'rounded',
      cornerStyle: 'rounded',
      fgColor: '#ffffff',
      forceWhiteLogo: true,
      transparentBg: true,
    };
  });

  useEffect(() => {
    const onPopState = () => {
      setCurrentRoute(resolveRouteFromLocation());
    };
    window.addEventListener('popstate', onPopState);
    window.addEventListener('hashchange', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('hashchange', onPopState);
    };
  }, []);

  const navigateTo = (route) => {
    window.history.pushState({}, '', route);
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateQrConfig = (patch) => {
    setQrConfig((prev) => ({ ...prev, ...patch }));
  };

  if (currentRoute === '/generator') {
    return (
      <BarcodeGeneratorStudio
        qrConfig={qrConfig}
        onUpdateQrConfig={updateQrConfig}
        onNavigate={navigateTo}
      />
    );
  }

  const activeExecutive =
    currentRoute === '/director'
      ? EXECUTIVES.director
      : currentRoute === '/cfo'
      ? EXECUTIVES.cfo
      : EXECUTIVES.ceo;

  return (
    <PublicProfileView
      executive={activeExecutive}
      qrConfig={qrConfig}
    />
  );
}

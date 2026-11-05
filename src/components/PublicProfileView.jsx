import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Briefcase,
  Phone,
  MapPin,
  Mail,
  Globe,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  UserPlus,
  BadgeCheck,
  MessageCircle,
  Sparkles,
  X,
  Download,
  ShieldCheck,
} from 'lucide-react';
import {
  COMPANY_INFO,
  formatWhatsAppUrl,
  formatTelUrl,
  downloadExecutiveVCard,
} from '../utils/profileState';
import { renderCustomQRCode } from '../utils/qrRenderer';

export default function PublicProfileView({ executive, qrConfig }) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);

  const inlineQrRef = useRef(null);
  const modalQrRef = useRef(null);

  const qrTargetUrl = executive.publicUrl;

  useEffect(() => {
    document.title = `${executive.fullName} — ${executive.jobTitle} | ${COMPANY_INFO.name}`;
  }, [executive]);

  useEffect(() => {
    if (inlineQrRef.current) {
      renderCustomQRCode(inlineQrRef.current, {
        ...qrConfig,
        fgColor: '#ffffff',
        forceWhiteLogo: true,
        transparentBg: true,
        value: qrTargetUrl,
        size: 640,
      });
    }
  }, [executive, qrConfig, qrTargetUrl]);

  useEffect(() => {
    if (showQrModal && modalQrRef.current) {
      renderCustomQRCode(modalQrRef.current, {
        ...qrConfig,
        fgColor: '#ffffff',
        forceWhiteLogo: true,
        transparentBg: true,
        value: qrTargetUrl,
        size: 960,
      });
    }
  }, [showQrModal, executive, qrConfig, qrTargetUrl]);

  const copyText = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleDownloadQr = async () => {
    const offscreen = document.createElement('canvas');
    await renderCustomQRCode(offscreen, {
      ...qrConfig,
      fgColor: '#ffffff',
      forceWhiteLogo: true,
      transparentBg: true,
      value: qrTargetUrl,
      size: 1400,
    });
    const link = document.createElement('a');
    link.download = `QR-${executive.slug.toUpperCase()}-${executive.fullName.replace(
      /\s+/g,
      '-'
    )}.png`;
    link.href = offscreen.toDataURL('image/png');
    link.click();
  };

  return (
    <div
      className="npc-executive-page"
      style={{
        background: executive.bgTheme,
        '--exec-accent': executive.accentColor,
        '--exec-accent-sec': executive.accentSecondary,
        '--exec-glow': executive.glowColor,
      }}
    >
      {/* Decorative Ambient Orbs & Grid Mesh */}
      <div
        className="exec-ambient-orb top-orb"
        style={{ background: executive.accentColor }}
      />
      <div
        className="exec-ambient-orb bottom-orb"
        style={{ background: executive.accentSecondary }}
      />
      <div className="exec-mesh-pattern" />

      <div className="npc-card-shell">
        {/* HERO IDENTITY CARD */}
        <section className="exec-hero-card">
          <div
            className="exec-hero-banner"
            style={{ background: executive.bannerGradient }}
          >
            <div className="banner-batik-overlay" />
            <div className="banner-top-row">
              {/* <span className="company-chip">
                <Sparkles size={12} />
                <span>NUSANTARA PROJECT CREATIVE</span>
              </span> */}
              <span className="verified-official-chip">
                <ShieldCheck size={13} />
                <span>Scanned from ID card</span>
              </span>
            </div>
          </div>

          <div className="exec-hero-body">
            {/* Center Emblem Avatar */}
            <div
              className="exec-emblem-ring"
              style={{
                borderColor: executive.accentColor,
                boxShadow: `0 14px 38px -6px ${executive.glowColor}`,
              }}
            >
              <div className="exec-emblem-inner">
                <img
                  src={COMPANY_INFO.logoUrl}
                  alt="Nusantara Project Creative"
                />
              </div>
              <div
                className="exec-verified-pin"
                style={{ background: executive.accentColor }}
                title="Verified Executive"
              >
                <BadgeCheck size={16} color="#050811" />
              </div>
            </div>

            <h1 className="exec-fullname">{executive.fullName}</h1>

            <div
              className="exec-role-pill"
              style={{
                borderColor: `${executive.accentColor}66`,
                color: executive.accentColor,
                background: `${executive.accentColor}18`,
              }}
            >
              {executive.jobTitle}
            </div>

            <p className="exec-org-subtitle">
              PT Nusantara Project Creative
            </p>

            {/* Primary CTA Buttons */}
            <div className="exec-primary-actions">
              {/* <button
                type="button"
                className="exec-cta-primary"
                onClick={() => downloadExecutiveVCard(executive)}
                style={{
                  background: `linear-gradient(135deg, ${executive.accentColor}, ${executive.accentSecondary})`,
                }}
              >
                <UserPlus size={17} />
                <span>Simpan Kontak (.vcf)</span>
              </button> */}

              <a
                href={formatWhatsAppUrl(executive.phones[0])}
                target="_blank"
                rel="noreferrer"
                className="exec-cta-secondary"
              >
                <MessageCircle size={17} style={{ color: '#10b981' }} />
                <span>WhatsApp</span>
              </a>

              {/* <button
                type="button"
                className="exec-cta-secondary"
                onClick={() => setShowQrModal(true)}
              >
                <QrCode size={17} style={{ color: executive.accentColor }} />
                <span>QR Code</span>
              </button> */}
            </div>
          </div>
        </section>

        {/* CREATIVE LINKTREE LIST (5 HARDCODED SECTIONS) */}
        <section className="exec-linktree-stack">
          {/* 1. NAMA LENGKAP */}
          <div className="exec-item-card featured-border">
            <div
              className="exec-item-icon"
              style={{
                background: `${executive.accentColor}1a`,
                color: executive.accentColor,
              }}
            >
              <User size={21} />
            </div>
            <div className="exec-item-content">
              <span
                className="exec-item-label"
                style={{ color: executive.accentColor }}
              >
                Nama Lengkap
              </span>
              <div className="exec-item-value-lg">{executive.fullName}</div>
              <span className="exec-item-sub">
                Identitas Eksekutif Resmi • Nusantara Project Creative
              </span>
            </div>
            <button
              type="button"
              className="exec-copy-square"
              onClick={() => {
                downloadExecutiveVCard(executive);
                setCopiedKey('name');
                setTimeout(() => setCopiedKey(null), 1800);
              }}
              title="Simpan ke Kontak (Add Contact)"
            >
              {copiedKey === 'name' ? (
                <Check size={16} color="#10b981" />
              ) : (
                <UserPlus size={16} />
              )}
            </button>
          </div>

          {/* 2. JABATAN */}
          <div className="exec-item-card">
            <div
              className="exec-item-icon"
              style={{
                background: `${executive.accentColor}1a`,
                color: executive.accentColor,
              }}
            >
              <Briefcase size={21} />
            </div>
            <div className="exec-item-content">
              <span
                className="exec-item-label"
                style={{ color: executive.accentColor }}
              >
                Jabatan
              </span>
              <div className="exec-item-value-lg">{executive.jobTitle}</div>
              {/* <span className="exec-item-sub">
                {executive.badgeText} • Nusantara Project Creative
              </span> */}
            </div>
            <button
              type="button"
              className="exec-copy-square"
              onClick={() => {
                downloadExecutiveVCard(executive);
                setCopiedKey('role');
                setTimeout(() => setCopiedKey(null), 1800);
              }}
              title="Simpan ke Kontak (Add Contact)"
            >
              {copiedKey === 'role' ? (
                <Check size={16} color="#10b981" />
              ) : (
                <UserPlus size={16} />
              )}
            </button>
          </div>

          {/* 3. NOMOR HP / TELEPON RESMI (DUAL NUMBERS) */}
          <div className="exec-item-card multi-row-card">
            <div className="multi-card-header">
              <div
                className="exec-item-icon"
                style={{
                  background: `${executive.accentColor}1a`,
                  color: executive.accentColor,
                }}
              >
                <Phone size={21} />
              </div>
              <div className="exec-item-content">
                <span
                  className="exec-item-label"
                  style={{ color: executive.accentColor }}
                >
                  Nomor HP & Telepon Resmi
                </span>
                <span className="exec-item-sub">
                  Klik nomor untuk Telepon langsung atau tombol WA untuk WhatsApp
                </span>
              </div>
            </div>

            <div className="phone-numbers-grid">
              {executive.phones.map((ph, idx) => (
                <div key={ph} className="phone-pill-row">
                  <div className="phone-number-left">
                    <span className="phone-index-badge">#{idx + 1}</span>
                    <a href={formatTelUrl(ph)} className="phone-number-text">
                      {ph}
                    </a>
                  </div>
                  <div className="phone-row-actions">
                    <a
                      href={formatWhatsAppUrl(ph)}
                      target="_blank"
                      rel="noreferrer"
                      className="wa-chip-btn"
                      title="Chat WhatsApp"
                    >
                      <MessageCircle size={13} />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={formatTelUrl(ph)}
                      className="mini-square-btn"
                      title="Telepon Seluler"
                    >
                      <Phone size={13} />
                    </a>
                    <button
                      type="button"
                      className="mini-square-btn"
                      onClick={() => {
                        downloadExecutiveVCard(executive, ph);
                        setCopiedKey(`save-phone-${idx}`);
                        setTimeout(() => setCopiedKey(null), 1800);
                      }}
                      title="Simpan ke Kontak (Add Contact)"
                    >
                      {copiedKey === `save-phone-${idx}` ? (
                        <Check size={14} color="#10b981" />
                      ) : (
                        <UserPlus size={14} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. ALAMAT KANTOR */}
          <div className="exec-item-card">
            <div
              className="exec-item-icon"
              style={{
                background: `${executive.accentColor}1a`,
                color: executive.accentColor,
              }}
            >
              <MapPin size={21} />
            </div>
            <div className="exec-item-content">
              <span
                className="exec-item-label"
                style={{ color: executive.accentColor }}
              >
                Alamat Kantor
              </span>
              <div className="exec-item-value-md">{executive.address}</div>
              <div className="address-action-bar">
                <a
                  href={COMPANY_INFO.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="maps-link-pill"
                  style={{
                    borderColor: `${executive.accentColor}55`,
                    color: executive.accentColor,
                  }}
                >
                  <ExternalLink size={13} />
                  <span>Buka di Google Maps</span>
                </a>
              </div>
            </div>
            <button
              type="button"
              className="exec-copy-square"
              onClick={() => {
                downloadExecutiveVCard(executive);
                setCopiedKey('address');
                setTimeout(() => setCopiedKey(null), 1800);
              }}
              title="Simpan ke Kontak (Add Contact)"
            >
              {copiedKey === 'address' ? (
                <Check size={16} color="#10b981" />
              ) : (
                <UserPlus size={16} />
              )}
            </button>
          </div>

          {/* 5. EMAIL BUSINESS, EMAIL PRIBADI & WEBSITE */}
          <div className="exec-item-card multi-row-card">
            <div className="multi-card-header">
              <div
                className="exec-item-icon"
                style={{
                  background: `${executive.accentColor}1a`,
                  color: executive.accentColor,
                }}
              >
                <Mail size={21} />
              </div>
              <div className="exec-item-content">
                <span
                  className="exec-item-label"
                  style={{ color: executive.accentColor }}
                >
                  Email & Website
                </span>
                <span className="exec-item-sub">
                  Email resmi eksekutif & website informasi perusahaan
                </span>
              </div>
            </div>

            <div className="email-web-stack">
              {/* Business Email */}
              <div className="contact-subcard">
                <div className="subcard-left">
                  <span
                    className="subcard-tag"
                    style={{
                      background: `${executive.accentColor}22`,
                      color: executive.accentColor,
                    }}
                  >
                    EMAIL 
                  </span>
                  <a
                    href={`mailto:${executive.emailBusiness}`}
                    className="subcard-link-val"
                  >
                    {executive.emailBusiness}
                  </a>
                </div>
                <div className="subcard-actions">
                  <a
                    href={`mailto:${executive.emailBusiness}`}
                    className="mini-square-btn"
                    title="Kirim Email"
                  >
                    <Mail size={13} />
                  </a>
                  <button
                    type="button"
                    className="mini-square-btn"
                    onClick={() => {
                      downloadExecutiveVCard(executive);
                      setCopiedKey('email-biz');
                      setTimeout(() => setCopiedKey(null), 1800);
                    }}
                    title="Simpan ke Kontak (Add Contact)"
                  >
                    {copiedKey === 'email-biz' ? (
                      <Check size={14} color="#10b981" />
                    ) : (
                      <UserPlus size={14} />
                    )}
                  </button>
                </div>
              </div>

              {/* Personal / Corporate Gmail */}
              {/* <div className="contact-subcard">
                <div className="subcard-left">
                  <span className="subcard-tag neutral">
                    EMAIL OFFICIAL / PERSONAL
                  </span>
                  <a
                    href={`mailto:${executive.emailPersonal}`}
                    className="subcard-link-val"
                  >
                    {executive.emailPersonal}
                  </a>
                </div>
                <div className="subcard-actions">
                  <a
                    href={`mailto:${executive.emailPersonal}`}
                    className="mini-square-btn"
                    title="Kirim Email"
                  >
                    <Mail size={13} />
                  </a>
                  <button
                    type="button"
                    className="mini-square-btn"
                    onClick={() =>
                      copyText(executive.emailPersonal, 'email-per')
                    }
                    title="Salin Email"
                  >
                    {copiedKey === 'email-per' ? (
                      <Check size={13} color="#10b981" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>
              </div> */}

              {/* Official Website */}
              <div className="contact-subcard">
                <div className="subcard-left">
                  <span className="subcard-tag web-tag">
                    <Globe size={11} />
                    <span>WEBSITE RESMI</span>
                  </span>
                  <a
                    href={`https://${executive.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="subcard-link-val"
                  >
                    {executive.website}
                  </a>
                </div>
                <div className="subcard-actions">
                  <a
                    href={`https://${executive.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mini-square-btn"
                    title="Buka Website"
                  >
                    <ExternalLink size={13} />
                  </a>
                  <button
                    type="button"
                    className="mini-square-btn"
                    onClick={() => {
                      downloadExecutiveVCard(executive);
                      setCopiedKey('website');
                      setTimeout(() => setCopiedKey(null), 1800);
                    }}
                    title="Simpan ke Kontak (Add Contact)"
                  >
                    {copiedKey === 'website' ? (
                      <Check size={14} color="#10b981" />
                    ) : (
                      <UserPlus size={14} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EMBEDDED EXECUTIVE QR BARCODE PASS */}
        {/* <section className="exec-qr-pass-card">
          <div className="qr-pass-info">
            <span
              className="qr-pass-badge"
              style={{
                background: `${executive.accentColor}20`,
                color: executive.accentColor,
              }}
            >
              <QrCode size={13} />
              <span>OFFICIAL DIGITAL BARCODE</span>
            </span>
            <h3>Scan QR — {executive.shortRole}</h3>
            <p>
              Arahkan kamera smartphone ke barcode di samping untuk membuka{' '}
              <code>id.nusantaraprojectcreative/{executive.slug}</code>
            </p>
            <div className="qr-pass-btns">
              <button
                type="button"
                className="qr-pass-download"
                onClick={handleDownloadQr}
                style={{
                  background: `linear-gradient(135deg, ${executive.accentColor}, ${executive.accentSecondary})`,
                }}
              >
                <Download size={15} />
                <span>Download Barcode PNG</span>
              </button>
            </div>
          </div>

          <div
            className="qr-pass-canvas-holder"
            onClick={() => setShowQrModal(true)}
            title="Klik untuk memperbesar QR Code"
          >
            <canvas ref={inlineQrRef} className="qr-pass-canvas" />
          </div>
        </section> */}

        <footer className="exec-footer">
          <img
            src={COMPANY_INFO.logoUrl}
            alt="NPC"
            className="white-filtered-logo"
          />
          <span>
            © {new Date().getFullYear()} {COMPANY_INFO.name}. All Rights Reserved.
          </span>
        </footer>
      </div>

      {/* FULLSCREEN QR MODAL */}
      {showQrModal && (
        <div
          className="qr-modal-backdrop"
          onClick={() => setShowQrModal(false)}
        >
          <div className="qr-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="qr-modal-header">
              <div>
                <h3>{executive.fullName}</h3>
                <p>
                  {executive.jobTitle} • id.nusantaraprojectcreative/
                  {executive.slug}
                </p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowQrModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="qr-modal-canvas-wrap">
              <canvas ref={modalQrRef} className="qr-modal-canvas" />
            </div>

            <div className="qr-modal-actions">
              <button
                type="button"
                className="qr-modal-download-btn"
                onClick={handleDownloadQr}
                style={{ background: executive.accentColor }}
              >
                <Download size={16} />
                <span>Download PNG</span>
              </button>
              <button
                type="button"
                className="qr-modal-vcard-btn"
                onClick={() => downloadExecutiveVCard(executive)}
              >
                <UserPlus size={16} />
                <span>Simpan Kontak</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

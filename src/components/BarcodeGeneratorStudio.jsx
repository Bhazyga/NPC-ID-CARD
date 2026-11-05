import React, { useEffect, useRef, useState } from 'react';
import {
  Upload,
  Download,
  RotateCcw,
  ExternalLink,
  Check,
  Copy,
} from 'lucide-react';
import { EXECUTIVE_LIST, COMPANY_INFO } from '../utils/profileState';
import { renderCustomQRCode } from '../utils/qrRenderer';

export default function BarcodeGeneratorStudio({
  qrConfig,
  onUpdateQrConfig,
  onNavigate,
}) {
  const fileInputRef = useRef(null);
  const canvasRefs = useRef({});
  const customCanvasRef = useRef(null);

  const [urlMode, setUrlMode] = useState('production');
  const [customLink, setCustomLink] = useState(
    'https://id.nusantaraprojectcreative/ceo'
  );
  const [copiedSlug, setCopiedSlug] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const getTargetUrl = (exec) => {
    if (urlMode === 'local') {
      return `${window.location.origin}${exec.route}`;
    }
    return exec.publicUrl;
  };

  // Render all 3 executive QR codes (Pure White + Transparent Background + Borderless White Logo)
  useEffect(() => {
    EXECUTIVE_LIST.forEach((exec) => {
      const canvas = canvasRefs.current[exec.slug];
      if (canvas) {
        renderCustomQRCode(canvas, {
          ...qrConfig,
          fgColor: '#ffffff',
          forceWhiteLogo: true,
          transparentBg: true,
          value: getTargetUrl(exec),
          size: 800,
        });
      }
    });
  }, [qrConfig, urlMode]);

  // Render custom link QR code
  useEffect(() => {
    if (customCanvasRef.current) {
      renderCustomQRCode(customCanvasRef.current, {
        ...qrConfig,
        fgColor: '#ffffff',
        forceWhiteLogo: true,
        transparentBg: true,
        value: customLink || 'https://nusantaraprojectcreative.com',
        size: 800,
      });
    }
  }, [qrConfig, customLink]);

  const handleFileProcess = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdateQrConfig({ logoUrl: reader.result, showLogo: true });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    handleFileProcess(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    handleFileProcess(file);
  };

  const handleDownloadExecQr = async (exec) => {
    const offscreen = document.createElement('canvas');
    await renderCustomQRCode(offscreen, {
      ...qrConfig,
      fgColor: '#ffffff',
      forceWhiteLogo: true,
      transparentBg: true,
      value: getTargetUrl(exec),
      size: 1600,
    });
    const link = document.createElement('a');
    link.download = `BARCODE-WHITE-TRANSPARENT-${exec.slug.toUpperCase()}-${exec.fullName.replace(
      /\s+/g,
      '-'
    )}.png`;
    link.href = offscreen.toDataURL('image/png');
    link.click();
  };

  const handleDownloadCustomQr = async () => {
    const offscreen = document.createElement('canvas');
    await renderCustomQRCode(offscreen, {
      ...qrConfig,
      fgColor: '#ffffff',
      forceWhiteLogo: true,
      transparentBg: true,
      value: customLink || 'https://nusantaraprojectcreative.com',
      size: 1600,
    });
    const link = document.createElement('a');
    link.download = `BARCODE-WHITE-TRANSPARENT-CUSTOM.png`;
    link.href = offscreen.toDataURL('image/png');
    link.click();
  };

  const handleCopyUrl = (text, slug) => {
    navigator.clipboard.writeText(text);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 1800);
  };

  return (
    <div className="generator-studio-container">
      {/* STEP 1: INPUT GAMBAR / LOGO TENGAH & PENGATURAN BARCODE */}
      <section className="studio-step-card">
        <div className="step-header-row">
          <div className="step-title-cluster">
            <span className="step-number-badge">STEP 1</span>
            <div>
              <h2>Input Gambar Logo Tengah (Otomatis Putih & Tanpa Background)</h2>
              <p>
                Masukkan gambar logo Anda—sistem otomatis mengubah logo &
                barcode menjadi <strong>Putih Bersih (#FFFFFF)</strong>,{' '}
                <strong>Tanpa Background (Transparan)</strong>, dan{' '}
                <strong>Tanpa Border di Tengah</strong>.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="reset-default-logo-btn"
            onClick={() =>
              onUpdateQrConfig({
                logoUrl: COMPANY_INFO.logoUrl,
                showLogo: true,
                logoSizeRatio: 0.23,
                dotStyle: 'rounded',
                cornerStyle: 'rounded',
                fgColor: '#ffffff',
                forceWhiteLogo: true,
                transparentBg: true,
              })
            }
          >
            <RotateCcw size={14} />
            <span>Reset Default NPC</span>
          </button>
        </div>

        <div className="upload-and-controls-grid">
          {/* Drag & Drop Image Input Box */}
          <div
            className={`logo-dropzone-box ${isDragging ? 'dragging' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              style={{ display: 'none' }}
            />
            <div className="dropzone-logo-preview dark-transparent-preview">
              <img
                src={qrConfig.logoUrl || COMPANY_INFO.logoUrl}
                alt="Center Logo Preview"
                className="white-filtered-logo"
              />
            </div>
            <div className="dropzone-text">
              <span className="upload-cta-pill">
                <Upload size={14} />
                <span>Pilih / Upload Gambar Logo Tengah</span>
              </span>
              <p>Otomatis dijadikan Putih & Transparan tanpa border di tengah barcode</p>
            </div>
          </div>

          {/* QR Style & Logo Controls */}
          <div className="qr-controls-panel">
            <div className="controls-grid-2col">
              <div className="field-group">
                <label>
                  Ukuran Logo di Tengah (
                  {Math.round((qrConfig.logoSizeRatio || 0.23) * 100)}%)
                </label>
                <input
                  type="range"
                  min="0.15"
                  max="0.28"
                  step="0.01"
                  value={qrConfig.logoSizeRatio || 0.23}
                  onChange={(e) =>
                    onUpdateQrConfig({
                      logoSizeRatio: parseFloat(e.target.value),
                    })
                  }
                />
              </div>

              <div className="field-group">
                <label>Gaya Titik Barcode (Pattern)</label>
                <select
                  value={qrConfig.dotStyle || 'rounded'}
                  onChange={(e) =>
                    onUpdateQrConfig({ dotStyle: e.target.value })
                  }
                >
                  <option value="rounded">Rounded Modern (Putih)</option>
                  <option value="dots">Circular Dots (Putih)</option>
                  <option value="diamond">Diamond Rhombus (Putih)</option>
                  <option value="square">Classic Square (Putih)</option>
                </select>
              </div>

              <div className="field-group">
                <label>Gaya Sudut Mata Barcode</label>
                <select
                  value={qrConfig.cornerStyle || 'rounded'}
                  onChange={(e) =>
                    onUpdateQrConfig({ cornerStyle: e.target.value })
                  }
                >
                  <option value="rounded">Extra Rounded</option>
                  <option value="circle">Circular Ring</option>
                  <option value="classy">Classy Executive</option>
                  <option value="square">Sharp Square</option>
                </select>
              </div>

              <div className="field-group">
                <label>Mode Tautan QR Barcode</label>
                <select
                  value={urlMode}
                  onChange={(e) => setUrlMode(e.target.value)}
                >
                  <option value="production">
                    Domain Resmi (id.nusantaraprojectcreative/...)
                  </option>
                  <option value="local">
                    URL Lokal Saat Ini ({window.location.host}/...)
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 2: HASIL GENERATE BARCODE UNTUK 3 EKSEKUTIF HARDCODED (/ceo, /director, /cfo) */}
      <section className="studio-step-card">
        <div className="step-header-row">
          <div className="step-title-cluster">
            <span className="step-number-badge">STEP 2</span>
            <div>
              <h2>
                Hasil QR Barcode Putih (No Background & Tanpa Border Tengah)
              </h2>
              <p>
                Saat di-download, file PNG memiliki background 100% transparan
                dengan titik barcode & logo tengah berwarna putih bersih.
              </p>
            </div>
          </div>
        </div>

        <div className="exec-qr-cards-grid">
          {EXECUTIVE_LIST.map((exec) => {
            const targetUrl = getTargetUrl(exec);
            return (
              <div
                key={exec.slug}
                className="exec-qr-generator-card"
                style={{
                  borderColor: `${exec.accentColor}55`,
                }}
              >
                <div className="exec-qr-card-top">
                  <span
                    className="exec-route-chip"
                    style={{
                      background: `${exec.accentColor}20`,
                      color: exec.accentColor,
                      borderColor: `${exec.accentColor}44`,
                    }}
                  >
                    id.nusantaraprojectcreative/{exec.slug}
                  </span>
                  <h3>{exec.fullName}</h3>
                  <p className="exec-qr-role">{exec.jobTitle}</p>
                </div>

                <div
                  className="exec-qr-canvas-box transparent-checker-stage"
                  onClick={() => onNavigate(exec.route)}
                  title={`Klik untuk membuka halaman ${exec.route}`}
                >
                  <canvas
                    ref={(el) => {
                      canvasRefs.current[exec.slug] = el;
                    }}
                    className="exec-generated-canvas"
                  />
                </div>

                <div className="exec-hardcoded-summary">
                  <div>
                    <strong>Telp:</strong> {exec.phones.join(' / ')}
                  </div>
                  <div>
                    <strong>Email:</strong> {exec.emailBusiness}
                  </div>
                  <div>
                    <strong>Web:</strong> {exec.website}
                  </div>
                </div>

                <div className="exec-qr-card-actions">
                  <button
                    type="button"
                    className="qr-btn-download"
                    onClick={() => handleDownloadExecQr(exec)}
                    style={{
                      background: `linear-gradient(135deg, ${exec.accentColor}, ${exec.accentSecondary})`,
                    }}
                  >
                    <Download size={15} />
                    <span>Download PNG Transparan</span>
                  </button>

                  <div className="qr-secondary-row">
                    <button
                      type="button"
                      className="qr-btn-open-web"
                      onClick={() => onNavigate(exec.route)}
                    >
                      <ExternalLink size={14} />
                      <span>Lihat Web /{exec.slug}</span>
                    </button>

                    <button
                      type="button"
                      className="qr-btn-copy-link"
                      onClick={() => handleCopyUrl(targetUrl, exec.slug)}
                      title="Salin URL"
                    >
                      {copiedSlug === exec.slug ? (
                        <Check size={14} color="#10b981" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* STEP 3: CUSTOM URL / TEXT BARCODE GENERATOR WITH CENTER LOGO */}
      <section className="studio-step-card">
        <div className="step-header-row">
          <div className="step-title-cluster">
            <span className="step-number-badge">EKSTRA</span>
            <div>
              <h2>Generate Barcode Putih Transparan — Link Custom</h2>
              <p>
                Ketik URL bebas di bawah untuk membuat QR Barcode putih tanpa
                background & tanpa border logo di tengah:
              </p>
            </div>
          </div>
        </div>

        <div className="custom-qr-generator-row">
          <div className="custom-qr-left">
            <div className="field-group">
              <label>Masukkan Link URL atau Teks Tujuan Barcode</label>
              <input
                type="text"
                value={customLink}
                onChange={(e) => setCustomLink(e.target.value)}
                placeholder="https://id.nusantaraprojectcreative/ceo"
              />
            </div>

            <div className="quick-preset-url-pills">
              <span>Isi Cepat:</span>
              {EXECUTIVE_LIST.map((exec) => (
                <button
                  key={exec.slug}
                  type="button"
                  className="preset-url-pill"
                  onClick={() => setCustomLink(exec.publicUrl)}
                >
                  id.nusantaraprojectcreative/{exec.slug}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="qr-btn-download custom-dl"
              onClick={handleDownloadCustomQr}
            >
              <Download size={16} />
              <span>Download PNG Putih Transparan (1600px)</span>
            </button>
          </div>

          <div className="custom-qr-right">
            <div className="exec-qr-canvas-box transparent-checker-stage">
              <canvas
                ref={customCanvasRef}
                className="exec-generated-canvas small"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

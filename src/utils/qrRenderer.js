import QRCode from 'qrcode';

/**
 * Check if (row, col) is part of one of the three 7x7 finder patterns
 */
function isFinderPattern(row, col, size) {
  if (row < 7 && col < 7) return true;
  if (row < 7 && col >= size - 7) return true;
  if (row >= size - 7 && col < 7) return true;
  return false;
}

/**
 * Check if (row, col) falls inside the center logo exclusion zone
 */
function isInCenterLogoZone(row, col, size, logoScale, hasLogo) {
  if (!hasLogo || logoScale <= 0) return false;
  const center = size / 2;
  const halfZone = (size * logoScale) / 2 + 0.75;
  return (
    row >= center - halfZone &&
    row <= center + halfZone &&
    col >= center - halfZone &&
    col <= center + halfZone
  );
}

/**
 * Helper to add a rounded rectangle subpath
 */
function addRoundRectSubpath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/**
 * Draw one custom 7x7 Finder Pattern (Eye) with a TRUE transparent cutout
 * using the 'evenodd' fill rule so no background color is needed.
 */
function drawFinderEyeTransparent(ctx, startX, startY, cellSize, cornerStyle, fillStyle) {
  const outerSize = cellSize * 7;
  const middleSize = cellSize * 5;
  const innerSize = cellSize * 3;

  const outerRadius =
    cornerStyle === 'circle'
      ? outerSize / 2
      : cornerStyle === 'rounded'
      ? cellSize * 2.2
      : cornerStyle === 'classy'
      ? cellSize * 1.4
      : 0;

  const middleRadius =
    cornerStyle === 'circle'
      ? middleSize / 2
      : cornerStyle === 'rounded'
      ? cellSize * 1.5
      : cornerStyle === 'classy'
      ? cellSize * 1.0
      : 0;

  const innerRadius =
    cornerStyle === 'circle'
      ? innerSize / 2
      : cornerStyle === 'rounded'
      ? cellSize * 0.95
      : cornerStyle === 'classy'
      ? cellSize * 0.65
      : 0;

  ctx.save();
  ctx.fillStyle = fillStyle;

  // Outer 7x7 minus Middle 5x5 hollow ring using evenodd
  ctx.beginPath();
  addRoundRectSubpath(ctx, startX, startY, outerSize, outerSize, outerRadius);
  addRoundRectSubpath(
    ctx,
    startX + cellSize,
    startY + cellSize,
    middleSize,
    middleSize,
    middleRadius
  );
  ctx.fill('evenodd');

  // Inner 3x3 eye ball
  ctx.beginPath();
  addRoundRectSubpath(
    ctx,
    startX + cellSize * 2,
    startY + cellSize * 2,
    innerSize,
    innerSize,
    innerRadius
  );
  ctx.fill();
  ctx.restore();
}

/**
 * Process an image so any solid white background is removed (made transparent)
 * and all logo shapes are converted to pure white (#FFFFFF).
 */
function createWhiteTransparentLogoCanvas(img, targetWidth, targetHeight) {
  const off = document.createElement('canvas');
  const w = Math.max(1, Math.round(targetWidth));
  const h = Math.max(1, Math.round(targetHeight));
  off.width = w;
  off.height = h;
  const octx = off.getContext('2d');
  octx.clearRect(0, 0, w, h);
  octx.drawImage(img, 0, 0, w, h);

  try {
    const imgData = octx.getImageData(0, 0, w, h);
    const data = imgData.data;

    // Detect if the image already has transparency (like LOGO NPC NEW ASLI.png)
    let hasTransparentPixels = false;
    for (let i = 3; i < data.length; i += 16) {
      if (data[i] < 200) {
        hasTransparentPixels = true;
        break;
      }
    }

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a < 15) {
        data[i + 3] = 0;
        continue;
      }

      if (!hasTransparentPixels) {
        // For opaque images (e.g. JPG with white background), remove bright white background
        const brightness = (r + g + b) / 3;
        if (brightness > 240) {
          data[i + 3] = 0;
          continue;
        }
        // Smooth anti-aliased edges based on darkness
        const shapeOpacity = Math.min(255, Math.round(((255 - brightness) / 200) * 255));
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
        data[i + 3] = Math.min(a, shapeOpacity);
      } else {
        // Image already has alpha channel (like LOGO NPC NEW ASLI.png):
        // Turn all visible pixels pure white (#FFFFFF) while preserving smooth alpha edges!
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
      }
    }

    octx.putImageData(imgData, 0, 0);
  } catch (e) {
    // Fallback using composite operation if getImageData is restricted
    octx.globalCompositeOperation = 'source-in';
    octx.fillStyle = '#ffffff';
    octx.fillRect(0, 0, w, h);
  }

  return off;
}

/**
 * Render custom QR code with pure white modules, transparent background,
 * and borderless pure white center logo onto an HTMLCanvasElement.
 */
export async function renderCustomQRCode(canvas, options) {
  if (!canvas) return;
  const {
    value = 'https://id.nusantaraprojectcreative/ceo',
    size = 1000,
    margin = 44,
    fgColor = '#ffffff',
    dotStyle = 'rounded', // 'square' | 'rounded' | 'dots' | 'diamond'
    cornerStyle = 'rounded', // 'square' | 'rounded' | 'circle' | 'classy'
    logoUrl = '/logo-npc.png',
    showLogo = true,
    logoSizeRatio = 0.23,
    forceWhiteLogo = true,
    transparentBg = true,
    bgColor = 'transparent',
  } = options;

  const safeValue =
    value && value.trim().length > 0
      ? value.trim()
      : 'https://id.nusantaraprojectcreative/ceo';

  let qrData;
  try {
    qrData = QRCode.create(safeValue, {
      errorCorrectionLevel: 'H',
    });
  } catch {
    qrData = QRCode.create(safeValue, {
      errorCorrectionLevel: 'M',
    });
  }

  const modules = qrData.modules;
  const moduleCount = modules.size;

  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // 100% Transparent background (no background fill)
  ctx.clearRect(0, 0, size, size);

  if (!transparentBg && bgColor && bgColor !== 'transparent') {
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    addRoundRectSubpath(ctx, 0, 0, size, size, size * 0.04);
    ctx.fill();
  }

  const drawableSize = size - margin * 2;
  const cellSize = drawableSize / moduleCount;

  // Pure white (or chosen fgColor) fill for barcode modules
  const barcodeColor = fgColor || '#ffffff';
  ctx.fillStyle = barcodeColor;

  // Draw data modules
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (!modules.get(row, col)) continue;
      if (isFinderPattern(row, col, moduleCount)) continue;
      if (
        isInCenterLogoZone(
          row,
          col,
          moduleCount,
          logoSizeRatio,
          showLogo && !!logoUrl
        )
      ) {
        continue;
      }

      const x = margin + col * cellSize;
      const y = margin + row * cellSize;

      if (dotStyle === 'dots') {
        ctx.beginPath();
        ctx.arc(
          x + cellSize / 2,
          y + cellSize / 2,
          (cellSize / 2) * 0.88,
          0,
          Math.PI * 2
        );
        ctx.fill();
      } else if (dotStyle === 'rounded') {
        const pad = cellSize * 0.05;
        ctx.beginPath();
        addRoundRectSubpath(
          ctx,
          x + pad,
          y + pad,
          cellSize - pad * 2,
          cellSize - pad * 2,
          cellSize * 0.36
        );
        ctx.fill();
      } else if (dotStyle === 'diamond') {
        const cx = x + cellSize / 2;
        const cy = y + cellSize / 2;
        const r = (cellSize / 2) * 0.94;
        ctx.beginPath();
        ctx.moveTo(cx, cy - r);
        ctx.lineTo(cx + r, cy);
        ctx.lineTo(cx, cy + r);
        ctx.lineTo(cx - r, cy);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(x, y, cellSize + 0.35, cellSize + 0.35);
      }
    }
  }

  // Draw the 3 Finder Patterns (Hollow transparent cutout)
  drawFinderEyeTransparent(ctx, margin, margin, cellSize, cornerStyle, barcodeColor);
  drawFinderEyeTransparent(
    ctx,
    margin + (moduleCount - 7) * cellSize,
    margin,
    cellSize,
    cornerStyle,
    barcodeColor
  );
  drawFinderEyeTransparent(
    ctx,
    margin,
    margin + (moduleCount - 7) * cellSize,
    cellSize,
    cornerStyle,
    barcodeColor
  );

  // Draw Center Logo: NO background, NO border, Pure White Logo!
  if (showLogo && logoUrl) {
    try {
      const img = await loadImage(logoUrl);
      const maxLogoBox = drawableSize * logoSizeRatio * 0.92;
      const centerX = size / 2;
      const centerY = size / 2;

      const aspect = img.width / img.height || 1;
      let drawW = maxLogoBox;
      let drawH = maxLogoBox;
      if (aspect > 1) {
        drawH = maxLogoBox / aspect;
      } else {
        drawW = maxLogoBox * aspect;
      }

      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      if (forceWhiteLogo) {
        const whiteLogoCanvas = createWhiteTransparentLogoCanvas(img, drawW * 2, drawH * 2);
        ctx.drawImage(
          whiteLogoCanvas,
          centerX - drawW / 2,
          centerY - drawH / 2,
          drawW,
          drawH
        );
      } else {
        ctx.drawImage(img, centerX - drawW / 2, centerY - drawH / 2, drawW, drawH);
      }

      ctx.restore();
    } catch (e) {
      console.warn('Could not load center logo:', e);
    }
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

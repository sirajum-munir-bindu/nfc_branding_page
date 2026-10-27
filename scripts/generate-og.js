const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function run() {
  const publicDir = path.join(__dirname, '..', 'public');
  const appDir = path.join(__dirname, '..', 'src', 'app');

  // Resize logo for OG banner header
  const logoBanner = await sharp(path.join(publicDir, 'logo.png'))
    .resize({ width: 340, height: 100, fit: 'inside' })
    .toBuffer();

  const ogSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#05070c" />
      <stop offset="50%" stop-color="#080d1a" />
      <stop offset="100%" stop-color="#0e172a" />
    </linearGradient>
    <radialGradient id="cyanGlow" cx="20%" cy="30%" r="45%">
      <stop offset="0%" stop-color="#00aeef" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#05070c" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="purpleGlow" cx="80%" cy="65%" r="55%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#05070c" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="cardBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00aeef" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#818cf8" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#f43f5e" stop-opacity="0.9" />
    </linearGradient>
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#111827" />
      <stop offset="100%" stop-color="#030712" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)" />
  <rect width="1200" height="630" fill="url(#cyanGlow)" />
  <rect width="1200" height="630" fill="url(#purpleGlow)" />

  <!-- Grid decoration lines -->
  <g stroke="#1e293b" stroke-width="1" opacity="0.3">
    <line x1="0" y1="105" x2="1200" y2="105" />
    <line x1="0" y1="210" x2="1200" y2="210" />
    <line x1="0" y1="315" x2="1200" y2="315" />
    <line x1="0" y1="420" x2="1200" y2="420" />
    <line x1="0" y1="525" x2="1200" y2="525" />
    <line x1="200" y1="0" x2="200" y2="630" />
    <line x1="400" y1="0" x2="400" y2="630" />
    <line x1="600" y1="0" x2="600" y2="630" />
    <line x1="800" y1="0" x2="800" y2="630" />
    <line x1="1000" y1="0" x2="1000" y2="630" />
  </g>

  <!-- Left Content Area -->
  <g transform="translate(90, 85)">
    <!-- Tag pill -->
    <rect x="0" y="0" width="235" height="36" rx="18" fill="#0891b2" fill-opacity="0.15" stroke="#00aeef" stroke-width="1.5" />
    <circle cx="20" cy="18" r="4.5" fill="#00aeef" />
    <text x="36" y="23" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="13" font-weight="700" fill="#00aeef" letter-spacing="1.5">OFFICIAL SMART NFC</text>

    <!-- Subtitle under logo -->
    <text x="0" y="230" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="36" font-weight="800" fill="#ffffff">Smart Business Cards</text>

    <!-- Description -->
    <text x="0" y="285" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="20" font-weight="400" fill="#94a3b8">
      <tspan x="0" dy="0">Instantly share your contact details, portfolio,</tspan>
      <tspan x="0" dy="30">and social links with a single tap on any phone.</tspan>
    </text>

    <!-- Feature Badges -->
    <g transform="translate(0, 360)">
      <rect x="0" y="0" width="150" height="42" rx="10" fill="#1e293b" fill-opacity="0.75" stroke="#334155" stroke-width="1.5" />
      <text x="18" y="26" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="15" font-weight="600" fill="#38bdf8">⚡ Instant Tap</text>

      <rect x="165" y="0" width="175" height="42" rx="10" fill="#1e293b" fill-opacity="0.75" stroke="#334155" stroke-width="1.5" />
      <text x="183" y="26" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="15" font-weight="600" fill="#818cf8">📱 iOS &amp; Android</text>

      <rect x="355" y="0" width="170" height="42" rx="10" fill="#1e293b" fill-opacity="0.75" stroke="#334155" stroke-width="1.5" />
      <text x="373" y="26" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="15" font-weight="600" fill="#34d399">♾️ Lifetime Profile</text>
    </g>
  </g>

  <!-- Right Graphic: 3D NFC Card Representation -->
  <g transform="translate(720, 130)">
    <!-- Back card glow -->
    <rect x="20" y="-15" width="400" height="255" rx="20" fill="#6366f1" fill-opacity="0.2" filter="url(#glow)" transform="rotate(7, 200, 130)" />

    <!-- Card Shadow -->
    <rect x="0" y="0" width="400" height="255" rx="20" fill="#000000" fill-opacity="0.6" transform="translate(18, 18) rotate(-4, 200, 130)" />

    <!-- Main Card Body -->
    <g transform="rotate(-4, 200, 130)">
      <rect x="0" y="0" width="400" height="255" rx="20" fill="url(#cardBg)" stroke="url(#cardBorder)" stroke-width="2.5" />

      <!-- Chip Graphic -->
      <rect x="42" y="42" width="52" height="42" rx="7" fill="#eab308" fill-opacity="0.85" stroke="#ca8a04" stroke-width="1.5" />
      <line x1="42" y1="63" x2="94" y2="63" stroke="#854d0e" stroke-width="1.5" />
      <line x1="68" y1="42" x2="68" y2="84" stroke="#854d0e" stroke-width="1.5" />
      <circle cx="68" cy="63" r="6" fill="#a16207" />

      <!-- Contactless waves icon -->
      <g transform="translate(325, 45)" stroke="#38bdf8" stroke-width="2.5" fill="none" stroke-linecap="round">
        <path d="M0 8 A12 12 0 0 1 0 24" />
        <path d="M7 3 A18 18 0 0 1 7 29" />
        <path d="M14 -2 A24 24 0 0 1 14 34" />
      </g>

      <!-- Brand on Card -->
      <text x="42" y="165" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="28" font-weight="900" fill="#ffffff" letter-spacing="1">Skill<tspan fill="#00aeef">.jobs</tspan></text>
      <text x="42" y="190" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="13" font-weight="700" fill="#00aeef" letter-spacing="2.5">SMART NFC EDITION</text>

      <!-- Card Number dots -->
      <text x="42" y="225" font-family="Consolas, monospace" font-size="14" fill="#64748b" letter-spacing="5">•••• •••• •••• 2026</text>
    </g>
  </g>
</svg>
`;

  const ogPath = path.join(publicDir, 'og-image.png');
  const baseImg = await sharp(Buffer.from(ogSvg)).png().toBuffer();

  // Composite the real logo into the banner
  await sharp(baseImg)
    .composite([
      {
        input: logoBanner,
        top: 145,
        left: 90,
      },
    ])
    .toFile(ogPath);

  console.log('Successfully created', ogPath);

  fs.copyFileSync(ogPath, path.join(appDir, 'opengraph-image.png'));
  fs.copyFileSync(ogPath, path.join(appDir, 'twitter-image.png'));

  // Also create a high-res favicon from the logo
  const faviconPath = path.join(publicDir, 'favicon.png');
  await sharp(path.join(publicDir, 'logo.png'))
    .resize({ width: 128, height: 128, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(faviconPath);

  console.log('Successfully created', faviconPath);
}

run().catch(console.error);

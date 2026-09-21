// Génère les icônes PWA (public/icons/*) à partir du logo SVG de la marque :
// carré arrondi dégradé teal→emerald + tracé « activité » blanc, rendu via canvas headless.
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const GLYPH = (scale, ty) =>
  `<g transform="translate(256 256) scale(${scale}) translate(-256 ${-256 + ty})">
     <path d="M88 268 L186 268 L228 158 L292 366 L332 268 L424 268"
           fill="none" stroke="#ffffff" stroke-width="46"
           stroke-linecap="round" stroke-linejoin="round"/>
   </g>`;

function svg(size, { maskable = false } = {}) {
  // glyph plus petit et centré pour maskable (safe-zone 60 %)
  const glyph = maskable ? GLYPH(0.62, 0) : GLYPH(0.92, 0);
  const rx = maskable ? 0 : 118;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#14b8a6"/>
      <stop offset="1" stop-color="#059669"/>
    </linearGradient>
    <radialGradient id="hl" cx="0.28" cy="0.22" r="0.75">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.22"/>
      <stop offset="0.5" stop-color="#ffffff" stop-opacity="0.05"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="clip"><rect width="512" height="512" rx="${rx}"/></clipPath>
  </defs>
  <g clip-path="url(#clip)">
    <rect width="512" height="512" fill="url(#g)"/>
    <rect width="512" height="512" fill="url(#hl)"/>
    ${glyph}
  </g>
</svg>`;
}

const OUT = "public/icons";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

const targets = [
  ["icon-192.png", 192, false],
  ["icon-512.png", 512, false],
  ["maskable-512.png", 512, true],
  ["apple-touch-icon.png", 180, true],
];

for (const [file, size, maskable] of targets) {
  const dataUrl = "data:image/svg+xml;base64," + Buffer.from(svg(512, { maskable })).toString("base64");
  const png = await page.evaluate(
    async ({ dataUrl, size }) => {
      const img = new Image();
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = dataUrl; });
      const c = document.createElement("canvas");
      c.width = size; c.height = size;
      c.getContext("2d").drawImage(img, 0, 0, size, size);
      return c.toDataURL("image/png");
    },
    { dataUrl, size }
  );
  fs.writeFileSync(path.join(OUT, file), Buffer.from(png.split(",")[1], "base64"));
  console.log("wrote", file, size + "x" + size);
}
await browser.close();

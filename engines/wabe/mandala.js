// 1. VARIABLEN (Hier einmalig definiert)
let APP = {
  engine: "wabe",
  mode: "geburtstag",
  input: "15011987",
  direction: "aussen",
  sector: 8,
  sliders: Array(10).fill(85),
  colors: [],
  isAdmin: false
};

let extState = {}; 
let logoImg = null;
let isAdmin = false;
let exportKind = "preview"; // Erste Definition
let lastPreviewKey = "";
let lastPreviewDataUrl = "";

const colorMatrix = {
  1: ["#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3"],
  2: ["#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3", "#FF0000"],
  3: ["#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3", "#FF0000", "#00008B"],
  4: ["#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3", "#FF0000", "#00008B", "#00FF00"],
  5: ["#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3", "#FF0000", "#00008B", "#00FF00", "#FFFF00"],
  6: ["#40E0D0", "#FFC0CB", "#FFA500", "#9400D3", "#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB"],
  7: ["#FFC0CB", "#FFA500", "#9400D3", "#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0"],
  8: ["#FFA500", "#9400D3", "#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB"],
  9: ["#9400D3", "#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500"]
};

const charMap = {
  'A':1,'J':1,'S':1,'Ä':1,'B':2,'K':2,'T':2,'Ö':2,'C':3,'L':3,'U':3,'Ü':3,'D':4,'M':4,'V':4,'ß':4,
  'E':5,'N':5,'W':5,'F':6,'O':6,'X':6,'G':7,'P':7,'Y':7,'H':8,'Q':8,'Z':8,'I':9,'R':9
};

const ex = (a, b) => (a + b === 0) ? 0 : ((a + b) % 9 === 0 ? 9 : (a + b) % 9);

// 2. KOMMUNIKATION
function sendReady() { if (window.parent) window.parent.postMessage({ type: "READY" }, "*"); }
function sendColors(colors) { if (window.parent) window.parent.postMessage({ type: "COLORS", colors }, "*"); }

window.addEventListener("message", (ev) => {
  const msg = ev.data;
  if (!msg || typeof msg !== "object") return;

  if (msg.type === "SET_STATE" && msg.payload) {
    APP = { ...APP, ...msg.payload, colors: Array.isArray(msg.payload.colors) ? msg.payload.colors : (APP.colors || []) };
    Object.assign(extState, msg.payload);
    isAdmin = !!APP.isAdmin;
    redraw();
  }

  if (msg.type === "EXPORT") {
    if (msg.payload) {
      Object.assign(extState, msg.payload);
      // HIER stand das falsche "let". Jetzt korrigiert:
      exportKind = (msg.payload.exportKind === "final") ? "final" : "preview";
    }
    exportHighRes(exportKind);
  }
});

// 3. P5.JS SETUP
function preload() {
  const p = (APP && APP.exportLogo) ? APP.exportLogo : "../../assets/Logo_black.png";
  logoImg = loadImage(p, () => {}, () => {
    logoImg = loadImage("../../assets/Logo.png", () => {}, () => { logoImg = null; });
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  smooth(8);
  noLoop();
  sendReady();
}

function draw() {
  background(12);
  const rawVal = String(APP.input || "").trim();
  if (rawVal === "" || (APP.mode === "geburtstag" && rawVal.replace(/\D/g, "").length === 0)) return;

  let code = (APP.mode === "text") ? getCodeFromText(rawVal) : rawVal.replace(/\D/g, "").split("").map(Number);
  while (code.length < 8) code.push(0);
  code = code.slice(0, 8);

  const cKey = code[0] || 1;
  const renderColors = getRenderColors(cKey);
  sendColors(renderColors);

  push();
  const isMobile = windowWidth < 600;
  translate(width / 2, height / 2 + (isMobile ? -10 : 10));
  scale((min(width, height) / 520) * (isMobile ? 0.45 : 0.48));
  renderWabeKorrekt(code, cKey, null, renderColors);
  pop();
}

// 4. LOGIK (UNANTASTBAR)
function renderWabeKorrekt(code, cKey, target, renderColorsOverride) {
  const ctx = target || window;
  const sz = 16.2;
  const renderColors = renderColorsOverride || getRenderColors(cKey);
  ctx.stroke(0, 0, 0, 35);
  ctx.strokeWeight(0.6);
  const path = (APP.direction === "innen") ? [...code, ...[...code].reverse()] : [...[...code].reverse(), ...code];

  for (let s = 0; s < 6; s++) {
    ctx.push(); ctx.rotate(s * PI / 3);
    const m = Array(17).fill().map(() => Array(17).fill(0));
    for (let i = 0; i < 16; i++) m[16][i] = path[i % path.length];
    for (let r = 15; r >= 1; r--) {
      for (let i = 0; i < r; i++) m[r][i] = ex(m[r + 1][i], m[r + 1][i + 1]);
    }
    for (let r = 1; r <= 16; r++) {
      for (let i = 0; i < r; i++) {
        const val = m[r][i];
        if (val >= 1 && val <= 9) {
          const col = color(renderColors[val - 1]);
          const sVal = (APP.sliders && typeof APP.sliders[val] === "number") ? APP.sliders[val] : 85;
          ctx.fill(hue(col), map(sVal, 20, 100, 35, saturation(col)), map(sVal, 20, 100, 100, brightness(col)));
        } else { ctx.fill(0, 0, 100); }
        const x = (i - (r - 1) / 2) * sz * sqrt(3);
        const y = -(r - 1) * sz * 1.5;
        ctx.beginShape();
        for (let a = PI / 6; a < TWO_PI; a += PI / 3) ctx.vertex(x + cos(a) * sz, y + sin(a) * sz);
        ctx.endShape(CLOSE);
      }
    }
    ctx.pop();
  }
}

function drawPreviewWatermark(g, wmImg, kind) {
  if (kind === "final" || !g || !wmImg || isAdmin) return;
  g.push(); g.resetMatrix();
  const ctx = g.drawingContext;
  if (ctx) { ctx.save(); ctx.globalAlpha = 0.32; }
  const wWidth = Math.round(g.width * 0.18);
  const wHeight = (wmImg.height / wmImg.width) * wWidth;
  for (let x = -wWidth; x < g.width + wWidth; x += wWidth * 1.8) {
    for (let y = -wHeight; y < g.height + wHeight; y += wHeight * 2.2) g.image(wmImg, x, y, wWidth, wHeight);
  }
  if (ctx) ctx.restore();
  g.pop();
}

async function exportHighRes(kind) {
  const settings = getExportSettings(kind);
  const cacheKey = JSON.stringify({ kind, input: APP.input, sliders: APP.sliders });
  if (settings.useCache && cacheKey === lastPreviewKey && lastPreviewDataUrl) {
    window.parent.postMessage({ type: "EXPORT_RESULT", dataUrl: lastPreviewDataUrl }, "*");
    return;
  }

  const pg = createGraphics(settings.width, settings.height);
  pg.colorMode(HSB, 360, 100, 100);
  pg.background(255);

  const rawVal = String(APP.input || "").trim();
  let code = (APP.mode === "text") ? getCodeFromText(rawVal) : rawVal.replace(/\D/g, "").split("").map(Number);
  while (code.length < 8) code.push(0);
  code = code.slice(0, 8);

  pg.push();
  pg.translate(pg.width / 2, pg.height * 0.40);
  pg.scale(2.4 * (pg.width / 2480));
  renderWabeKorrekt(code, code[0] || 1, pg, getRenderColors(code[0] || 1));
  pg.pop();

  const exportLogo = await waitForLogo(settings.logoWaitMs);
  if (kind !== "final") drawPreviewWatermark(pg, exportLogo, kind);

  if (exportLogo) {
    const lW = kind === "final" ? 500 : Math.round(pg.width * 0.18);
    const lH = (exportLogo.height / exportLogo.width) * lW;
    const margin = kind === "final" ? 100 : Math.round(pg.width * 0.04);
    pg.image(exportLogo, pg.width - lW - margin, pg.height - lH - margin, lW, lH);
  }

  const dUrl = pg.canvas.toDataURL("image/png");
  if (settings.useCache) { lastPreviewKey = cacheKey; lastPreviewDataUrl = dUrl; }
  window.parent.postMessage({ type: "EXPORT_RESULT", dataUrl: dUrl }, "*");
}

function getExportSettings(kind) {
  const isMob = windowWidth < 900;
  if (kind === "final") return { width: 2480, height: 3508, logoWaitMs: 5000, useCache: false };
  return { width: isMob ? 1240 : 1800, height: isMob ? 1754 : 2545, logoWaitMs: isMob ? 350 : 800, useCache: true };
}

function waitForLogo(maxMs) {
  return new Promise(resolve => {
    const start = Date.now();
    const tick = () => {
      if (logoImg || Date.now() - start > maxMs) return resolve(logoImg);
      setTimeout(tick, 50);
    };
    tick();
  });
}

function getCodeFromText(t) {
  let r = String(t || "").toUpperCase().replace(/[^A-ZÄÖÜß]/g, "").split("").map(c => charMap[c]).filter(n => n);
  if (r.length === 0) return [0,0,0,0,0,0,0,0];
  while (r.length < 8) r.push(9);
  while (r.length > 8) {
    const next = [];
    for (let i = 0; i < r.length - 1; i++) next.push(ex(r[i], r[i+1]));
    r = next;
  }
  return r;
}

function getRenderColors(k) {
  return (Array.isArray(APP.colors) && APP.colors.length === 9) ? APP.colors : (colorMatrix[k] || colorMatrix[1]);
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); redraw(); }

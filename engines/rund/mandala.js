// --------- STATE (kommt vom Parent) ----------
let APP = {
  engine: "rund",
  mode: "geburtstag",
  input: "15011987",
  direction: "aussen",
  sector: 8,
  sliders: Array(10).fill(85),
  colors: [],
  isAdmin: false
};

console.log("RUND mandala.js LOADED v=1014");

// --------- KONSTANTEN ----------
var baseColors = [
  "#FF0000",
  "#00008B",
  "#00FF00",
  "#FFFF00",
  "#87CEEB",
  "#40E0D0",
  "#FFC0CB",
  "#FFA500",
  "#9400D3"
];

var affirmMap = {
  A:1, J:1, S:1, Ä:1,
  B:2, K:2, T:2, Ö:2,
  C:3, L:3, U:3, Ü:3,
  D:4, M:4, V:4, ß:4,
  E:5, N:5, W:5,
  F:6, O:6, X:6,
  G:7, P:7, Y:7,
  H:8, Q:8, Z:8,
  I:9, R:9
};

var ex = (a, b) => (a + b) % 9 === 0 ? 9 : (a + b) % 9;

// --------- VARIABLEN ----------
let logoImg = null;
let colorSeed = 1;
let isAdmin = false;

let exportKind = "preview";
let lastPreviewKey = "";
let lastPreviewDataUrl = "";

// --------- Messaging ----------
function sendReady() {
  if (window.parent) window.parent.postMessage({ type: "READY" }, "*");
}

function sendColors(colors) {
  if (window.parent) window.parent.postMessage({ type: "COLORS", colors }, "*");
}

window.addEventListener("message", (ev) => {
  const msg = ev.data;
  if (!msg || typeof msg !== "object") return;

  if (msg.type === "SET_STATE" && msg.payload) {
    APP = {
      ...APP,
      ...msg.payload,
      colors: Array.isArray(msg.payload.colors) ? msg.payload.colors : APP.colors
    };
    isAdmin = !!APP.isAdmin;
    redraw();
    return;
  }

  if (msg.type === "EXPORT") {
    if (msg.payload) {
      APP = {
        ...APP,
        ...msg.payload,
        colors: Array.isArray(msg.payload.colors) ? msg.payload.colors : APP.colors
      };
      isAdmin = !!APP.isAdmin;
      exportKind = msg.payload.exportKind === "final" ? "final" : "preview";
    } else {
      exportKind = "preview";
    }

    exportHighRes(exportKind);
    return;
  }
});

// --------- p5 ----------
function preload() {
  const p = (APP && APP.exportLogo) ? APP.exportLogo : "../../assets/Logo_black.png";

  logoImg = loadImage(
    p,
    () => {},
    () => {
      logoImg = loadImage(
        "../../assets/Logo.png",
        () => {},
        () => { logoImg = null; }
      );
    }
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  const c = document.querySelector("canvas");
  if (c) {
    c.addEventListener("contextmenu", (e) => e.preventDefault());
    c.addEventListener("dragstart", (e) => e.preventDefault());
  }

  colorMode(HSB, 360, 100, 100);
  noLoop();
  sendReady();
  redraw();
}

function draw() {
  background(12);

  const rawVal = String(APP.input || "").trim();
  if (rawVal === "" || (APP.mode === "geburtstag" && rawVal.replace(/\D/g, "").length === 0)) return;

  const sector = buildSector();
  const currentColors = getRenderColors(colorSeed);

  sendColors(currentColors);

  push();

  const isMobile = windowWidth < 600;
  const centerY = isMobile ? height / 2 - 10 : height / 2 + 10;
  const centerX = width / 2;

  translate(centerX, centerY);

  const scaleFactor = (min(width, height) / 900) * (isMobile ? 0.85 : 0.95);
  scale(scaleFactor);

  const sc = int(APP.sector || 8);
  const angle = TWO_PI / sc;

  for (let i = 0; i < sc; i++) {
    push();
    rotate(i * angle);
    drawSector(sector, currentColors);
    pop();
  }

  pop();
}

// --------- ZEICHNEN ----------
function drawSector(m, colors, target) {
  const ctx = target || window;
  const step = 20;
  const sc = int(APP.sector || 8);
  const angle = TWO_PI / sc;
  const h = tan(angle / 2) * step;

  ctx.stroke(0, 0, 0, 35);
  ctx.strokeWeight(0.6);

  for (let r = 0; r < m.length; r++) {
    for (let c = 0; c <= r; c++) {
      const v = m[r][c];
      const x = r * step;
      const y = (c - r / 2) * h * 2;

      if (v >= 1 && v <= 9) {
        const baseCol = color(colors[v - 1]);
        const sVal = (APP.sliders && typeof APP.sliders[v] === "number") ? APP.sliders[v] : 85;

        ctx.fill(
          hue(baseCol),
          map(sVal, 20, 100, 35, saturation(baseCol)),
          map(sVal, 20, 100, 100, brightness(baseCol))
        );
      } else {
        ctx.fill(0, 0, 100);
      }

      ctx.beginShape();
      ctx.vertex(x, y);
      ctx.vertex(x + step, y - h);
      ctx.vertex(x + step * 2, y);
      ctx.vertex(x + step, y + h);
      ctx.endShape(CLOSE);
    }
  }
}

// --------- EXPORT-WASSERZEICHEN ----------
function drawPreviewWatermark(g, wmImg) {
  if (!g || !wmImg || isAdmin) return;

  g.push();
  g.resetMatrix();

  const ctx = g.drawingContext;
  if (ctx) ctx.save();
  if (ctx) ctx.globalAlpha = 0.45;

  /* exakt alte Optik, nur proportional zur kleineren Vorschau */
  const ratio = g.width / 2480;

  const wWidth = 380 * ratio;
  const wHeight = (wmImg.height / wmImg.width) * wWidth;
  const yShift = -200 * ratio;

  const startX = -100 * ratio;
  const startY = -700 * ratio;
  const endX = g.width + 400 * ratio;
  const endY = g.height + 400 * ratio;
  const step = 500 * ratio;

  for (let x = startX; x < endX; x += step) {
    for (let y = startY; y < endY; y += step) {
      g.image(wmImg, x, y + yShift, wWidth, wHeight);
    }
  }

  if (ctx) ctx.restore();
  g.pop();
}

function drawPreviewWatermark(g, wmImg) {
  if (!g || !wmImg || isAdmin) return;

  g.push();
  g.resetMatrix();

  const ctx = g.drawingContext;
  if (ctx) ctx.save();
  if (ctx) ctx.globalAlpha = 0.34;

  const isMobilePreview = g.width <= 1240;

  const wWidth = isMobilePreview ? 300 : 340;
  const wHeight = (wmImg.height / wmImg.width) * wWidth;

  const stepX = isMobilePreview ? 390 : 430;
  const stepY = isMobilePreview ? 390 : 430;
  const yShift = isMobilePreview ? -150 : -180;

  for (let x = -120; x < g.width + 320; x += stepX) {
    for (let y = -520; y < g.height + 320; y += stepY) {
      g.image(wmImg, x, y + yShift, wWidth, wHeight);
    }
  }

  if (ctx) ctx.restore();
  g.pop();
}
function waitForLogo(maxMs = 5000) {
  return new Promise(resolve => {
    const start = Date.now();
    const tick = () => {
      if (logoImg) return resolve(logoImg);
      if (Date.now() - start > maxMs) return resolve(null);
      setTimeout(tick, 50);
    };
    tick();
  });
}

function getExportSettings(kind = "preview") {
  const isMobileViewport = windowWidth < 900;

  if (kind === "final") {
    return {
      width: 2480,
      height: 3508,
      logoWaitMs: 5000,
      useCache: false
    };
  }

  if (isMobileViewport) {
    return {
      width: 1240,
      height: 1754,
      logoWaitMs: 350,
      useCache: true
    };
  }

  return {
    width: 1800,
    height: 2545,
    logoWaitMs: 800,
    useCache: true
  };
}

function getExportScale(kind, exportW) {
  const baseFinalScale = APP.engine === "rund" ? 3.0 : 3.2;
  return baseFinalScale * (exportW / 2480);
}

function buildPreviewCacheKey(kind, settings) {
  return JSON.stringify({
    kind,
    engine: APP.engine,
    mode: APP.mode,
    input: APP.input,
    direction: APP.direction,
    sector: APP.sector,
    sliders: APP.sliders,
    colors: APP.colors,
    isAdmin: APP.isAdmin,
    w: settings.width,
    h: settings.height
  });
}

// --------- EXPORT ----------
async function exportHighRes(kind = "preview") {
  const settings = getExportSettings(kind);
  const exportW = settings.width;
  const exportH = settings.height;

  const cacheKey = buildPreviewCacheKey(kind, settings);
  if (settings.useCache && cacheKey === lastPreviewKey && lastPreviewDataUrl) {
    try {
      window.parent.postMessage({
        type: "EXPORT_RESULT",
        dataUrl: lastPreviewDataUrl
      }, "*");
    } catch (_) {}
    return;
  }

  const pg = createGraphics(exportW, exportH);

  pg.colorMode(HSB, 360, 100, 100);
  pg.background(255);

  const sector = buildSector();
  const currentColors = getRenderColors(colorSeed);
  const sc = int(APP.sector || 8);
  const angle = TWO_PI / sc;

  pg.push();
  pg.translate(exportW / 2, exportH * 0.40);

  const exportScale = getExportScale(kind, exportW);
  pg.scale(exportScale);

  for (let i = 0; i < sc; i++) {
    pg.push();
    pg.rotate(i * angle);
    drawSector(sector, currentColors, pg);
    pg.pop();
  }
  pg.pop();

  const exportLogo = await waitForLogo(settings.logoWaitMs);

  if (kind === "final") {
    drawExportWatermark(pg, exportLogo);
  } else {
    drawPreviewWatermark(pg, exportLogo);
  }

  if (exportLogo) {
    pg.push();
    pg.resetMatrix();
    pg.noTint();

    const lW = kind === "final" ? 500 : Math.round(exportW * 0.18);
    const lH = (exportLogo.height / exportLogo.width) * lW;
    const margin = kind === "final" ? 100 : Math.round(exportW * 0.04);

    pg.image(exportLogo, exportW - lW - margin, exportH - lH - margin, lW, lH);
    pg.pop();
  }

  const dataUrl = pg.canvas.toDataURL("image/png");

  if (settings.useCache) {
    lastPreviewKey = cacheKey;
    lastPreviewDataUrl = dataUrl;
  }

  try {
    window.parent.postMessage({
      type: "EXPORT_RESULT",
      dataUrl: dataUrl
    }, "*");
  } catch (_) {}
}

// --------- RICHTIGE RUND-LOGIK ----------
function buildSector() {
  var n = 16;
  var m = Array.from({ length: n }, (_, r) => Array(r + 1).fill(0));

  var isText = APP.mode === "text";
  var raw = isText
    ? codeFromAffirm(APP.input)
    : String(APP.input || "").replace(/\D/g, "").split("").map(Number);

  while (raw.length < 8) raw.push(0);
  raw = raw.slice(0, 8);

  colorSeed = raw[0] || 1;

  var frame = (APP.direction === "innen") ? [...raw].reverse() : [...raw];
  var base = [...frame].reverse().concat(frame);

  for (var i = 0; i < 16; i++) m[15][i] = base[i];
  for (var i = 0; i < 16; i++) {
    var r = 15 - i;
    m[r][0] = base[i];
    m[r][r] = base[i];
  }

  for (var c = 1; c <= 13; c++) m[14][c] = ex(m[15][c], m[15][c + 1]);

  var c14 = (c, t) => t.forEach(([r, k]) => m[r][k] = m[14][c]);
  c14(1, [[2, 1]]);
  c14(2, [[3, 1], [3, 2], [13, 1], [13, 12]]);
  c14(3, [[4, 1], [4, 3], [12, 1], [12, 11]]);
  c14(4, [[5, 1], [5, 4], [11, 1], [11, 10]]);
  c14(5, [[6, 1], [6, 5], [10, 1], [10, 9]]);
  c14(6, [[7, 1], [7, 6], [9, 1], [9, 8]]);
  c14(7, [[8, 1], [8, 7]]);

  for (var c = 2; c <= 10; c++) m[13][c] = ex(m[14][c], m[14][c + 1]);

  var c13 = (c, t) => t.forEach(([r, k]) => m[r][k] = m[13][c]);
  c13(2, [[4, 2], [13, 11]]);
  c13(3, [[12, 2], [12, 10], [5, 2], [5, 3]]);
  c13(4, [[11, 2], [11, 9], [6, 4], [6, 2]]);
  c13(5, [[10, 2], [10, 8], [7, 5], [7, 2]]);
  c13(6, [[9, 2], [9, 7], [8, 6], [8, 2]]);

  for (var j = 3; j <= 8; j++) m[12][j] = ex(m[13][j], m[13][j + 1]);

  var c12 = (c, t) => t.forEach(([r, k]) => m[r][k] = m[12][c]);
  c12(3, [[12, 9], [6, 3]]);
  c12(4, [[11, 3], [11, 8], [7, 4], [7, 3]]);
  c12(5, [[10, 3], [10, 7], [8, 5], [8, 3]]);
  c12(6, [[9, 3], [9, 6]]);

  m[11][4] = ex(m[12][4], m[12][5]);
  m[11][5] = ex(m[12][5], m[12][6]);
  m[11][6] = ex(m[12][6], m[12][7]);

  var c11 = (c, t) => t.forEach(([r, k]) => m[r][k] = m[11][c]);
  c11(4, [[11, 7], [8, 4]]);
  c11(5, [[10, 4], [10, 6], [9, 4], [9, 5]]);

  m[10][5] = ex(m[11][5], m[11][6]);

  return m;
}

// --------- AFFIRMATION ----------
function codeFromAffirm(text) {
  var arr = [];
  text = String(text || "").toUpperCase().replace(/[^A-ZÄÖÜß]/g, "");

  for (var c of text) {
    if (affirmMap[c]) arr.push(affirmMap[c]);
  }

  while (arr.length > 8) {
    var n = [];
    for (var i = 0; i < arr.length - 1; i++) {
      n.push(ex(arr[i], arr[i + 1]));
    }
    arr = n;
  }

  while (arr.length < 8) arr.push(0);
  return arr.slice(0, 8);
}

// --------- FARBEN ----------
function getColorMatrix(seed) {
  var s = (seed === 0 || !seed) ? 1 : seed;
  var shift = (s - 1) % 9;
  return baseColors.slice(shift).concat(baseColors.slice(0, shift));
}

function getRenderColors(seed) {
  if (Array.isArray(APP.colors) && APP.colors.length === 9) {
    return APP.colors;
  }
  return getColorMatrix(seed);
}

// --------- RESIZE ----------
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}

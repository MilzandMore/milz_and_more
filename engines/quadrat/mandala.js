/* ====== QUADRAT engine / engines/quadrat/mandala.js ====== */

console.log("QUADRAT mandala.js LOADED v=1005");

var qMatrix = [];
var logoImg = null;
var isAdmin = false;

const PHI = 1.61803398875;

function isEmbed() {
  const p = new URLSearchParams(location.search);
  if (p.get("embed") === "1") return true;
  try { return window.self !== window.top; } catch (e) { return true; }
}
var EMBED = isEmbed();

var extState = {
  engine: "quadrat",
  mode: "geburtstag",
  input: "15011987",
  direction: "aussen",
  sliders: Array(10).fill(85),
  colors: [],
  isAdmin: false,
  paperLook: true
};

const mapZ = {
  1: "#FFD670", 2: "#DEAAFF", 3: "#FF686B",
  4: "#7A5BEC", 5: "#74FB92", 6: "#E9FF70",
  7: "#C0FDFF", 8: "#B2C9FF", 9: "#FFCBF2"
};

var colorMatrix = {
  1: { 1: "#FF0000", 2: "#0000FF", 3: "#00FF00", 4: "#FFFF00", 5: "#00B0F0", 6: "#00FFFF", 7: "#FF66FF", 8: "#FF9900", 9: "#9900FF" },
  2: { 1: "#0000FF", 2: "#00FF00", 3: "#FFFF00", 4: "#00B0F0", 5: "#00FFFF", 6: "#FF66FF", 7: "#FF9900", 8: "#9900FF", 9: "#FF0000" },
  3: { 1: "#00FF00", 2: "#FFFF00", 3: "#00B0F0", 4: "#00FFFF", 5: "#FF66FF", 6: "#FF9900", 7: "#9900FF", 8: "#FF0000", 9: "#0000FF" },
  4: { 1: "#FFFF00", 2: "#00B0F0", 3: "#00FFFF", 4: "#FF66FF", 5: "#FF9900", 6: "#9900FF", 7: "#FF0000", 8: "#0000FF", 9: "#00FF00" },
  5: { 1: "#00B0F0", 2: "#00FFFF", 3: "#FF66FF", 4: "#FF9900", 5: "#9900FF", 6: "#FF0000", 7: "#0000FF", 8: "#00FF00", 9: "#FFFF00" },
  6: { 1: "#00FFFF", 2: "#FF66FF", 3: "#FF9900", 4: "#9900FF", 5: "#FF0000", 6: "#0000FF", 7: "#00FF00", 8: "#FFFF00", 9: "#00B0F0" },
  7: { 1: "#FF66FF", 2: "#FF9900", 3: "#9900FF", 4: "#FF0000", 5: "#0000FF", 6: "#00FF00", 7: "#FFFF00", 8: "#00B0F0", 9: "#00FFFF" },
  8: { 1: "#FF9900", 2: "#9900FF", 3: "#FF0000", 4: "#0000FF", 5: "#00FF00", 6: "#FFFF00", 7: "#00B0F0", 8: "#00FFFF", 9: "#FF66FF" },
  9: { 1: "#9900FF", 2: "#FF0000", 3: "#0000FF", 4: "#00FF00", 5: "#FFFF00", 6: "#00B0F0", 7: "#00FFFF", 8: "#FF66FF", 9: "#FF9900" }
};

var charMap = {
  'A': 1, 'J': 1, 'S': 1, 'Ä': 1, 'B': 2, 'K': 2, 'T': 2, 'Ö': 2,
  'C': 3, 'L': 3, 'U': 3, 'Ü': 3, 'D': 4, 'M': 4, 'V': 4, 'ß': 4,
  'E': 5, 'N': 5, 'W': 5, 'F': 6, 'O': 6, 'X': 6, 'G': 7, 'P': 7,
  'Y': 7, 'H': 8, 'Q': 8, 'Z': 8, 'I': 9, 'R': 9
};

function ex(a, b) {
  var s = (a || 0) + (b || 0);
  return (s === 0) ? 0 : (s % 9 === 0 ? 9 : s % 9);
}

function preload() {}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  pixelDensity(2);

  loadImage("../../assets/Logo_black.png",
    img => logoImg = img,
    () => loadImage("/milz_and_more/assets/Logo_black.png",
      img => logoImg = img
    )
  );

  if (EMBED) {
    noLoop();
    window.addEventListener("message", onMessageFromParent);
    try { window.parent.postMessage({ type: "READY" }, "*"); } catch (_) {}
    redraw();
  }
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

function draw() {
  background(12);

  const baseCode = (getMode() === "geburtstag")
    ? getCodeFromDate(getInput())
    : getCodeFromText(getInput());

  const startDigit = baseCode[0] || 1;
  const drawCode = (getDirection() === "innen") ? [...baseCode].reverse() : baseCode;

  push();
  const scaleFactor = (min(width, height) / 850) * 0.9;
  translate(width / 2, height / 2);
  scale(scaleFactor);

  calcQuadratMatrix(drawCode);
  drawQuadrat(startDigit, null, { stroke: true });
  pop();
}

function getRenderPalette(startDigit) {
  if (Array.isArray(extState.colors) && extState.colors.length === 9) {
    return {
      1: extState.colors[0],
      2: extState.colors[1],
      3: extState.colors[2],
      4: extState.colors[3],
      5: extState.colors[4],
      6: extState.colors[5],
      7: extState.colors[6],
      8: extState.colors[7],
      9: extState.colors[8]
    };
  }

  return (colorMatrix[startDigit] || mapZ);
}

function drawQuadrat(startDigit, target, opts) {
  var ctx = target || window;
  var ts = 16;
  const strokeOn = opts && opts.stroke === true;

  ctx.rectMode(CORNER);

  if (strokeOn) {
    ctx.stroke(0, 0, 0, 35);
    ctx.strokeWeight(0.6);
  } else {
    ctx.noStroke();
  }

  const renderPalette = getRenderPalette(startDigit);

  for (var r = 0; r < 20; r++) {
    for (var c = 0; c < 20; c++) {
      var val = qMatrix[r][c];

      if (val === 0) {
        ctx.fill(0, 0, 100, 100);
      } else {
        var hex = renderPalette[val] || mapZ[val];
        var col = color(hex);
        var sVal = getSlider(val);

        ctx.fill(
          hue(col),
          map(sVal, 20, 100, 35, saturation(col)),
          map(sVal, 20, 100, 100, brightness(col)),
          100
        );
      }

      ctx.rect(c * ts, -(r + 1) * ts, ts, ts);
      ctx.rect(-(c + 1) * ts, -(r + 1) * ts, ts, ts);
      ctx.rect(c * ts, r * ts, ts, ts);
      ctx.rect(-(c + 1) * ts, r * ts, ts, ts);
    }
  }
}

/* ====== EXPORT ====== */
async function exportHighRes() {

  const exportW = 2480, exportH = 3508;

  const pg = createGraphics(exportW, exportH);
  pg.colorMode(HSB, 360, 100, 100, 100);
  pg.background(255);

  const baseCode = (getMode() === "geburtstag")
    ? getCodeFromDate(getInput())
    : getCodeFromText(getInput());

  const startDigit = baseCode[0] || 1;
  const drawCode = (getDirection() === "innen") ? [...baseCode].reverse() : baseCode;

  calcQuadratMatrix(drawCode);

  const ts = 16;
  const gridSize = 40 * ts;
  const targetSizePx = exportW / PHI;
  const scale = targetSizePx / gridSize;

  const centerX = exportW / 2;
  const centerY = exportH * (1 / (PHI * PHI));

  pg.push();
  pg.translate(centerX, centerY);
  pg.scale(scale);
  drawQuadrat(startDigit, pg, { stroke: true });
  pg.pop();

  const exportLogo = await waitForLogo(5000);

  if (exportLogo && !isAdmin) {
    pg.resetMatrix();
    pg.tint(255, 0.45);

    const wWidth = 380;
    const wHeight = (exportLogo.height / exportLogo.width) * wWidth;
    const yShift = -200;

    for (let x = -100; x < exportW + 400; x += 500) {
      for (let y = -700; y < exportH + 400; y += 500) {
        pg.image(exportLogo, x, y + yShift, wWidth, wHeight);
      }
    }
    pg.noTint();
  }

  if (exportLogo) {
    pg.resetMatrix();
    pg.noTint();

    const lW = 500;
    const lH = (exportLogo.height / exportLogo.width) * lW;
    pg.image(exportLogo, exportW - lW - 100, exportH - lH - 100, lW, lH);
  }

  /* ===== WICHTIG: kein Download mehr ===== */

  const dataUrl = pg.canvas.toDataURL("image/png");

  try {
    window.parent.postMessage({
      type: "EXPORT_RESULT",
      dataUrl: dataUrl
    }, "*");
  } catch (_) {}
}

function onMessageFromParent(ev) {
  const msg = ev.data;
  if (!msg || typeof msg !== "object") return;

  if (msg.type === "SET_STATE" && msg.payload) {
    extState = Object.assign(extState, msg.payload);
    if (!Array.isArray(extState.colors)) extState.colors = [];
    isAdmin = !!extState.isAdmin;
    redraw();
  }

  if (msg.type === "EXPORT") {
    if (msg.payload) {
      extState = Object.assign(extState, msg.payload);
      if (!Array.isArray(extState.colors)) extState.colors = [];
      isAdmin = !!extState.isAdmin;
    }

    exportHighRes();
  }
}

function getMode() {
  return EMBED ? (extState.mode || "geburtstag") : "geburtstag";
}

function getInput() {
  return EMBED ? (extState.input ?? "15011987") : "15011987";
}

function getDirection() {
  return EMBED ? (extState.direction || "aussen") : "aussen";
}

function getSlider(val) {
  if (!EMBED) return 85;
  const arr = extState.sliders || [];
  const v = arr[val];
  return (typeof v === "number") ? v : 85;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (EMBED) redraw();
}

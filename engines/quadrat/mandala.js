var qMatrix = [];
var logoImg;
var logoImgBlack;
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
  isAdmin: false,
  paperLook: true
};

const mapZ = { 1: "#FFD670", 2: "#DEAAFF", 3: "#FF686B", 4: "#7A5BEC", 5: "#74FB92", 6: "#E9FF70", 7: "#C0FDFF", 8: "#B2C9FF", 9: "#FFCBF2" };

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

function preload() {
  logoImgBlack = loadImage("../../assets/Logo_black.png", () => { }, () => { logoImgBlack = null; });
  logoImg = loadImage("../../assets/Logo.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  pixelDensity(2);

  var params = getURLParams();
  if (params.access === 'milz_secret') isAdmin = true;

  if (EMBED) {
    noLoop();
    window.addEventListener("message", onMessageFromParent);
    try { window.parent.postMessage({ type: "READY" }, "*"); } catch (_) { }
    redraw();
  }
}

function draw() {
  background(12);

  const isMobile = windowWidth < 600;

  const baseCode = (getMode() === "geburtstag") ? getCodeFromDate(getInput()) : getCodeFromText(getInput());
  const startDigit = baseCode[0] || 1;
  const drawCode = (getDirection() === "innen") ? [...baseCode].reverse() : baseCode;

  if (EMBED) {
    try {
      const colors = [];
      for (let i = 1; i <= 9; i++) {
        let hex = (colorMatrix[startDigit] && colorMatrix[startDigit][i]) ? colorMatrix[startDigit][i] : mapZ[i];
        colors.push(hex);
      }
      window.parent.postMessage({ type: "COLORS", colors }, "*");
    } catch (_) { }
  }

  push();
  const scaleFactor = (min(width, height) / 850) * (isMobile ? 0.82 : 0.92);
  translate(width / 2, height / 2);
  scale(scaleFactor);

  calcQuadratMatrix(drawCode);
  drawQuadrat(startDigit, null, { stroke: true });
  pop();
}

function drawQuadrat(startDigit, target, opts) {
  var ctx = target || window;
  var ts = 16;
  const strokeOn = opts && opts.stroke === true;

  ctx.rectMode(CORNER);

  if (strokeOn) {
    ctx.stroke(0, 0, 0, 35);
    ctx.strokeWeight(1);
  } else {
    ctx.noStroke();
  }

  for (var r = 0; r < 20; r++) {
    for (var c = 0; c < 20; c++) {
      var val = qMatrix[r][c];
      if (val !== 0) {
        var hex = (colorMatrix[startDigit] && colorMatrix[startDigit][val]) ? colorMatrix[startDigit][val] : mapZ[val];
        var col = color(hex);

        var sVal = getSlider(val);
        ctx.fill(
          hue(col),
          map(sVal, 20, 100, 15, saturation(col)),
          map(sVal, 20, 100, 98, brightness(col)),
          100
        );

        ctx.rect(c * ts, -(r + 1) * ts, ts, ts);
        ctx.rect(-(c + 1) * ts, -(r + 1) * ts, ts, ts);
        ctx.rect(c * ts, r * ts, ts, ts);
        ctx.rect(-(c + 1) * ts, r * ts, ts, ts);
      }
    }
  }
}

function exportHighRes() {
  const exportW = 2480;
  const exportH = 3508;

  const pg = createGraphics(exportW, exportH);
  pg.colorMode(HSB, 360, 100, 100, 100);
  pg.background(255);

  const baseCode = (getMode() === "geburtstag") ? getCodeFromDate(getInput()) : getCodeFromText(getInput());
  const startDigit = baseCode[0] || 1;
  const drawCode = (getDirection() === "innen") ? [...baseCode].reverse() : baseCode;

  calcQuadratMatrix(drawCode);

  const ts = 16;
  const gridSize = 40 * ts; // 640
  const targetSizePx = exportW / PHI; // ~1533
  const scale = targetSizePx / gridSize;

  const centerX = exportW / 2;
  const centerY = exportH * (1 / (PHI * PHI)); // 0.382

  pg.push();
  pg.translate(centerX, centerY);
  pg.scale(scale);
  drawQuadrat(startDigit, pg, { stroke: true });
  pg.pop();

  const exportLogo = logoImgBlack || logoImg;

  // Wasserzeichen: kleiner + kein Überlappen (größerer Abstand + versetzte Reihen)
  if (exportLogo && !isAdmin) {
    pg.resetMatrix();
    pg.push();
    pg.colorMode(RGB, 255);

    pg.tint(0, 0, 0, 70);

    const wWidth = 320; // ✅ kleiner als vorher (380) -> weniger "Balken"
    const wHeight = (exportLogo.height / exportLogo.width) * wWidth;

    const stepX = 560;  // ✅ mehr Luft horizontal
    const stepY = 560;  // ✅ mehr Luft vertikal

    // versetzte Reihen, damit keine "Linien" entstehen
    let row = 0;
    for (let y = -140; y < exportH + 500; y += stepY) {
      const xOffset = (row % 2 === 0) ? 0 : Math.round(stepX / 2);
      for (let x = -140; x < exportW + 500; x += stepX) {
        pg.image(exportLogo, x + xOffset, y, wWidth, wHeight);
      }
      row++;
    }

    pg.noTint();
    pg.pop();
  }

  // Signatur unten rechts
  if (exportLogo) {
    pg.resetMatrix();
    pg.push();
    pg.colorMode(RGB, 255);

    pg.tint(0, 0, 0, 190);

    const lW = 760;
    const lH = (exportLogo.height / exportLogo.width) * lW;

    pg.image(exportLogo, exportW - lW - 100, exportH - lH - 100, lW, lH);

    pg.noTint();
    pg.pop();
  }

  save(pg, 'Milz&More_Quadrat.png');
}

/* --------- state helpers --------- */
function getMode() { return EMBED ? (extState.mode || "geburtstag") : "geburtstag"; }
function getInput() { return EMBED ? (extState.input ?? "15011987") : "15011987"; }
function getDirection() { return EMBED ? (extState.direction || "aussen") : "aussen"; }
function getSlider(val) {
  if (!EMBED) return 85;
  const arr = extState.sliders || [];
  const v = arr[val];
  return (typeof v === "number") ? v : 85;
}

/* --------- code gen --------- */
function getCodeFromDate(str) {
  var val = String(str || "").replace(/[^0-9]/g, "");
  var res = val.split('').map(Number);
  while (res.length < 8) res.push(0);
  return res.slice(0, 8);
}

function getCodeFromText(textStr) {
  var t = String(textStr || "").toUpperCase().replace(/[^A-ZÄÖÜß]/g, "");
  if (t.length === 0) return [1, 1, 1, 1, 1, 1, 1, 1];
  var firstRow = [];
  for (var char of t) { if (charMap[char]) firstRow.push(charMap[char]); }
  var currentRow = firstRow;
  while (currentRow.length < 8) currentRow.push(9);
  while (currentRow.length > 8) {
    var nextRow = [];
    for (var i = 0; i < currentRow.length - 1; i++) {
      var sum = currentRow[i] + currentRow[i + 1];
      nextRow.push(sum % 9 === 0 ? 9 : sum % 9);
    }
    currentRow = nextRow;
  }
  return currentRow;
}

function ex(a, b) {
  var s = (a || 0) + (b || 0);
  return (s === 0) ? 0 : (s % 9 === 0 ? 9 : s % 9);
}

function calcQuadratMatrix(code) {
  qMatrix = Array(20).fill().map(() => Array(20).fill(0));
  var d = [code[0], code[1]], m = [code[2], code[3]], j1 = [code[4], code[5]], j2 = [code[6], code[7]];

  function set2(r, c, v1, v2) {
    if (r >= 20 || c >= 20) return;
    qMatrix[r][c] = v1;
    if (c + 1 < 20) qMatrix[r][c + 1] = v2;
    if (r + 1 < 20) qMatrix[r + 1][c] = v2;
    if (r + 1 < 20 && c + 1 < 20) qMatrix[r + 1][c + 1] = v1;
  }

  for (var i = 0; i < 8; i += 2) set2(i, i, d[0], d[1]);
  for (var i = 0; i < 6; i += 2) { set2(i, i + 2, m[0], m[1]); set2(i + 2, i, m[0], m[1]); }
  for (var i = 0; i < 4; i += 2) { set2(i, i + 4, j1[0], j1[1]); set2(i + 4, i, j1[0], j1[1]); }
  set2(0, 6, j2[0], j2[1]); set2(6, 0, j2[0], j2[1]);

  for (var r = 0; r < 8; r++) {
    for (var c = 8; c < 20; c++) qMatrix[r][c] = ex(qMatrix[r][c - 2], qMatrix[r][c - 1]);
  }
  for (var c = 0; c < 20; c++) {
    for (var r = 8; r < 20; r++) qMatrix[r][c] = ex(qMatrix[r - 2][c], qMatrix[r - 1][c]);
  }
}

/* --------- messaging --------- */
function onMessageFromParent(ev) {
  const msg = ev.data;
  if (!msg || typeof msg !== "object") return;

  if (msg.type === "SET_STATE" && msg.payload) {
    extState = Object.assign(extState, msg.payload);
    if (msg.payload.isAdmin === true) isAdmin = true;
    redraw();
  }

  if (msg.type === "EXPORT") {
    if (msg.payload) {
      extState = Object.assign(extState, msg.payload);
      if (msg.payload.isAdmin === true) isAdmin = true;
    }
    exportHighRes();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (EMBED) redraw();
}

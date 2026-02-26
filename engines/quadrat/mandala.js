// --------- STATE (kommt vom Parent) ----------
let APP = {
  engine: "quadrat",
  mode: "geburtstag",      // geburtstag | affirmation
  input: "15011987",
  direction: "aussen",     // aussen | innen
  sector: 8,               // irrelevant hier
  sliders: Array(10).fill(85), // 1..9
  isAdmin: false
};

// --------- ORIGINAL DATA ----------
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
  'A':1,'J':1,'S':1,'Ä':1,'B':2,'K':2,'T':2,'Ö':2,'C':3,'L':3,'U':3,'Ü':3,'D':4,'M':4,'V':4,'ß':4,
  'E':5,'N':5,'W':5,'F':6,'O':6,'X':6,'G':7,'P':7,'Y':7,'H':8,'Q':8,'Z':8,'I':9,'R':9
};

let qMatrix = [];
let logoImg;
let isAdmin = false;

// --------- ENGINE COMMS ----------
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
    APP = msg.payload;
    isAdmin = !!APP.isAdmin;
    redraw();
  }
  if (msg.type === "EXPORT") {
    if (msg.payload) { APP = msg.payload; isAdmin = !!APP.isAdmin; }
    exportHighRes();
  }
});

// --------- P5 ----------
function preload() {
  const p = (APP && APP.exportLogo) ? APP.exportLogo : "../../assets/Logo_black.png";
  logoImg = loadImage(
    p,
    () => {},
    () => { logoImg = loadImage("../../assets/Logo.png"); }
  );
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  noLoop();
  sendReady();
  redraw();
}

function draw() {
  // Pro-Optik: dunkler Studio-Hintergrund statt Weiß
  background(12);

  const baseCode = (APP.mode === "geburtstag") ? getCodeFromDate(APP.input) : getCodeFromText(APP.input);
  const startDigit = baseCode[0] || 1;
  const drawCode = (APP.direction === "innen") ? [...baseCode].reverse() : baseCode;

  // Colors für Slider-Dots an Parent schicken
  const colors = [];
  for (let i = 1; i <= 9; i++) {
    const hex = (colorMatrix[startDigit] && colorMatrix[startDigit][i]) ? colorMatrix[startDigit][i] : mapZ[i];
    colors.push(hex);
  }
  sendColors(colors);

  push();
  const isMobile = windowWidth < 600;
  const scaleFactor = (min(width, height) / 850) * (isMobile ? 0.80 : 0.95);
  const centerY = isMobile ? height / 2 - 10 : height / 2 + 10;
  const centerX = width / 2;

  translate(centerX, centerY);
  scale(scaleFactor);

  calcQuadratMatrix(drawCode);
  drawQuadrat(startDigit);
  pop();
}

function drawQuadrat(startDigit, target) {
  const ctx = target || window;
  const ts = 16;

  ctx.stroke(255, 18);
  ctx.strokeWeight(0.6);

  for (let r = 0; r < 20; r++) {
    for (let c = 0; c < 20; c++) {
      const val = qMatrix[r][c];
      if (val !== 0) {
        const hex = (colorMatrix[startDigit] && colorMatrix[startDigit][val]) ? colorMatrix[startDigit][val] : mapZ[val];
        const col = color(hex);

        const sVal = (APP.sliders && APP.sliders[val]) ? APP.sliders[val] : 85;
        ctx.fill(
          hue(col),
          map(sVal, 20, 100, 15, saturation(col)),
          map(sVal, 20, 100, 98, brightness(col))
        );

        ctx.rect(c * ts, -(r + 1) * ts, ts, ts); ctx.rect(-(c + 1) * ts, -(r + 1) * ts, ts, ts);
        ctx.rect(c * ts, r * ts, ts, ts);        ctx.rect(-(c + 1) * ts, r * ts, ts, ts);
      }
    }
  }
}

function exportHighRes() {
  const exportW = 2480, exportH = 3508;
  const pg = createGraphics(exportW, exportH);
  pg.colorMode(HSB, 360, 100, 100);
  pg.background(255);

  const baseCode = (APP.mode === "geburtstag") ? getCodeFromDate(APP.input) : getCodeFromText(APP.input);
  const startDigit = baseCode[0] || 1;
  const drawCode = (APP.direction === "innen") ? [...baseCode].reverse() : baseCode;

  pg.push();
  pg.translate(exportW / 2, exportH * 0.40);
  pg.scale(3.8);
  calcQuadratMatrix(drawCode);
  drawQuadrat(startDigit, pg);
  pg.pop();

  if (logoImg && !isAdmin) {
    pg.resetMatrix(); pg.tint(255, 0.45);
    const wWidth = 380; const wHeight = (logoImg.height / logoImg.width) * wWidth;
    for (let x = -100; x < exportW + 400; x += 500) {
      for (let y = -100; y < exportH + 400; y += 500) pg.image(logoImg, x, y, wWidth, wHeight);
    }
    pg.noTint();
  }

  if (logoImg) {
    const lW = 500; const lH = (logoImg.height / logoImg.width) * lW;
    pg.image(logoImg, exportW - lW - 100, exportH - lH - 100, lW, lH);
  }

  save(pg, 'Milz&More_Quadrat.png');
}

// ---- helpers ----
function getCodeFromDate(value) {
  const val = String(value || "").replace(/[^0-9]/g, "");
  const res = val.split('').map(Number);
  while (res.length < 8) res.push(0);
  return res.slice(0, 8);
}

function getCodeFromText(value) {
  const textStr = String(value || "").toUpperCase().replace(/[^A-ZÄÖÜß]/g, "");
  if (textStr.length === 0) return [1,1,1,1,1,1,1,1];
  let firstRow = [];
  for (const ch of textStr) if (charMap[ch]) firstRow.push(charMap[ch]);
  let currentRow = firstRow;
  while (currentRow.length < 8) currentRow.push(9);
  while (currentRow.length > 8) {
    const nextRow = [];
    for (let i = 0; i < currentRow.length - 1; i++) {
      const sum = currentRow[i] + currentRow[i+1];
      nextRow.push(sum % 9 === 0 ? 9 : sum % 9);
    }
    currentRow = nextRow;
  }
  return currentRow;
}

function ex(a, b) {
  const s = (a || 0) + (b || 0);
  return (s === 0) ? 0 : (s % 9 === 0 ? 9 : s % 9);
}

function calcQuadratMatrix(code) {
  qMatrix = Array(20).fill().map(() => Array(20).fill(0));
  const d  = [code[0], code[1]], m  = [code[2], code[3]], j1 = [code[4], code[5]], j2 = [code[6], code[7]];

  function set2(r, c, v1, v2) {
    if (r >= 20 || c >= 20) return;
    qMatrix[r][c] = v1;
    if (c+1 < 20) qMatrix[r][c+1] = v2;
    if (r+1 < 20) qMatrix[r+1][c] = v2;
    if (r+1 < 20 && c+1 < 20) qMatrix[r+1][c+1] = v1;
  }

  for (let i = 0; i < 8; i+=2) set2(i, i, d[0], d[1]);
  for (let i = 0; i < 6; i+=2) { set2(i, i+2, m[0], m[1]); set2(i+2, i, m[0], m[1]); }
  for (let i = 0; i < 4; i+=2) { set2(i, i+4, j1[0], j1[1]); set2(i+4, i, j1[0], j1[1]); }
  set2(0, 6, j2[0], j2[1]); set2(6, 0, j2[0], j2[1]);

  for (let r = 0; r < 8; r++) for (let c = 8; c < 20; c++) qMatrix[r][c] = ex(qMatrix[r][c-2], qMatrix[r][c-1]);
  for (let c = 0; c < 20; c++) for (let r = 8; r < 20; r++) qMatrix[r][c] = ex(qMatrix[r-2][c], qMatrix[r-1][c]);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}

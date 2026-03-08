// --------- STATE (kommt vom Parent) ----------
let APP = {
  engine: "rund",
  mode: "geburtstag",
  input: "15011987",
  direction: "aussen",
  sector: 8,
  sliders: Array(10).fill(85),
  isAdmin: false
};

// --------- KONSTANTEN ----------
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
    APP = msg.payload;
    isAdmin = !!APP.isAdmin;
    redraw();
  }

  if (msg.type === "EXPORT") {
    if (msg.payload) {
      APP = msg.payload;
      isAdmin = !!APP.isAdmin;
    }
    exportHighRes();
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
  const currentColors = getColorMatrix(colorSeed);

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
        const sVal = (APP.sliders && APP.sliders[v]) ? APP.sliders[v] : 85;

        ctx.fill(
          hue(baseCol),
          map(sVal, 20, 100, 15, saturation(baseCol)),
          map(sVal, 20, 100, 98, brightness(baseCol))
        );
      } else {
        ctx.fill(0, 0, 100); // 0er weiß
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

// --------- EXPORT ----------
function exportHighRes() {
  const exportW = 2480;
  const exportH = 3508;
  const pg = createGraphics(exportW, exportH);

  pg.colorMode(HSB, 360, 100, 100);
  pg.background(255);

  const sector = buildSector();
  const currentColors = getColorMatrix(colorSeed);
  const sc = int(APP.sector || 8);
  const angle = TWO_PI / sc;

  // Mandala auf Druckseite
  pg.push();
  pg.translate(exportW / 2, exportH * 0.40);
  pg.scale(3.2);

  for (let i = 0; i < sc; i++) {
    pg.push();
    pg.rotate(i * angle);
    drawSector(sector, currentColors, pg);
    pg.pop();
  }
  pg.pop();

  // Wasserzeichen nur ohne Premium/Admin
  if (logoImg && !isAdmin) {
    pg.resetMatrix();
    pg.tint(255, 0.45);

    const wWidth = 380;
    const wHeight = (logoImg.height / logoImg.width) * wWidth;

    for (let x = -100; x < exportW + 400; x += 500) {
      for (let y = -400; y < exportH + 400; y += 500) {
        pg.image(logoImg, x, y, wWidth, wHeight);
      }
    }

    pg.noTint();
  }

  // Logo unten rechts
  if (logoImg) {
    pg.resetMatrix();
    pg.noTint();

    const lW = 500;
    const lH = (logoImg.height / logoImg.width) * lW;
    pg.image(logoImg, exportW - lW - 100, exportH - lH - 100, lW, lH);
  }

  save(pg, "Milz&More_Rund.png");
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

// --------- RESIZE ----------
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}

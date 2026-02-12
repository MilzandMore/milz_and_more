// 1. GLOBALE KONSTANTEN & VARIABLEN
const baseColors = ["#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3"];
const affirmMap = { 
  A:1,J:1,S:1,Ä:1, B:2,K:2,T:2,Ö:2, C:3,L:3,U:3,Ü:3, D:4,M:4,V:4,ß:4, 
  E:5,N:5,W:5, F:6,O:6,X:6, G:7,P:7,Y:7, H:8,Q:8,Z:8, I:9,R:9 
};
const ex = (a,b) => (a + b) % 9 === 0 ? 9 : (a + b) % 9;

let modeSelect, inputField, designSelect, codeDisplay, sektS, richtungS, sliders = [], colorIndicators = [], sliderPanel;
let logoImg;
let colorSeed = 1;
let qMatrix = []; // Für Quadrat-Logik

function preload() {
  logoImg = loadImage('logo.png', () => {}, () => {
    logoImg = loadImage('Logo.png', () => {}, () => console.log("Logo fehlt"));
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  let isMobile = windowWidth < 600;

  // TOPBAR
  let topBar = createDiv("").style('position', 'fixed').style('top', '0').style('left', '0').style('width', '100%')
    .style('background', '#2c3e50').style('color', '#fff').style('display', 'flex').style('padding', isMobile ? '4px 6px' : '10px 15px')
    .style('gap', isMobile ? '4px' : '15px').style('font-family', '"Inter", sans-serif').style('z-index', '200')
    .style('align-items', 'flex-start').style('box-sizing', 'border-box').style('height', isMobile ? '50px' : '75px');

  function createUIGroup(labelTxt, element, wMobile, wDesktop) {
    let group = createDiv("").parent(topBar).style('display', 'flex').style('flex-direction', 'column');
    createSpan(labelTxt).parent(group).style('font-size', '7px').style('color', '#bdc3c7').style('text-transform', 'uppercase').style('font-weight', 'bold').style('margin-bottom', '2px');
    if (element) {
      element.parent(group).style('width', isMobile ? wMobile : wDesktop)
        .style('font-size', isMobile ? '10px' : '13px').style('background', '#34495e').style('color', '#fff')
        .style('border', 'none').style('border-radius', '3px').style('padding', isMobile ? '3px' : '6px');
    }
    return group;
  }

  designSelect = createSelect();
  ['Quadrat', 'Rund', 'Wabe'].forEach(d => designSelect.option(d));
  designSelect.selected('Rund');
  createUIGroup("DESIGN", designSelect, "65px", "100px");

  modeSelect = createSelect();
  modeSelect.option('Geburtstag'); modeSelect.option('Affirmation');
  createUIGroup("MODUS", modeSelect, "65px", "110px");

  inputField = createInput("15011987");
  createUIGroup("EINGABE", inputField, "75px", "130px");

  let codeGroup = createUIGroup("CODE", null, "auto", "auto");
  codeDisplay = createSpan("").parent(codeGroup).style('font-size', isMobile ? '9px' : '14px').style('color', '#fff').style('padding', '4px 0');

  sektS = createSelect();
  ["6","8","10","12","13"].forEach(s => sektS.option(s, s)); sektS.selected("8");
  createUIGroup("SEKTOR", sektS, "40px", "60px");

  richtungS = createSelect(); 
  richtungS.option("Außen", "a"); richtungS.option("Innen", "b");
  richtungS.selected("a");
  createUIGroup("RICHTUNG", richtungS, "55px", "100px");

  let saveBtn = createButton('DOWNLOAD').parent(topBar)
    .style('margin-left', 'auto').style('background', '#ffffff').style('color', '#2c3e50')
    .style('border', 'none').style('font-weight', 'bold').style('border-radius', '4px')
    .style('padding', isMobile ? '6px 6px' : '10px 15px')
    .style('font-size', isMobile ? '9px' : '13px').style('cursor', 'pointer').style('margin-top', isMobile ? '11px' : '14px');
  saveBtn.mousePressed(exportHighRes);

  sliderPanel = createDiv("").style('position', 'fixed').style('background', 'rgba(44, 62, 80, 0.98)').style('z-index', '150');
  for (let i = 1; i <= 9; i++) {
    let sRow = createDiv("").parent(sliderPanel).style('display','flex').style('align-items','center').style('gap','4px');
    colorIndicators[i] = createDiv("").parent(sRow).style('width', '8px').style('height', '8px').style('border-radius', '50%');
    sliders[i] = createSlider(20, 100, 85).parent(sRow).input(() => redraw());
  }

  updateLayout();
  [designSelect, modeSelect, inputField, sektS, richtungS].forEach(e => {
    if(e.input) e.input(redraw);
    if(e.changed) e.changed(redraw);
  });
  noLoop();
}

function updateLayout() {
  let isMobile = windowWidth < 600;
  if (isMobile) {
    sliderPanel.style('top', 'auto').style('bottom', '0').style('left', '0').style('width', '100%')
      .style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)').style('padding', '12px 6px').style('gap', '8px');
    for (let i = 1; i <= 9; i++) if(sliders[i]) sliders[i].style('width', '75px');
  } else {
    sliderPanel.style('bottom', 'auto').style('top', '95px').style('left', '0').style('width', 'auto')
      .style('display', 'flex').style('flex-direction', 'column').style('padding', '12px').style('border-radius', '0 8px 8px 0');
    for (let i = 1; i <= 9; i++) if(sliders[i]) sliders[i].style('width', '80px');
  }
}

function draw() {
  let isMobile = windowWidth < 600;
  let rawVal = inputField.value().trim();
  if (rawVal === "" || (modeSelect.value() === 'Geburtstag' && rawVal.replace(/\D/g, "").length === 0)) return;

  background(255);
  const currentColors = getColorMatrix(colorSeed);
  for (let i = 1; i <= 9; i++) { if(colorIndicators[i]) colorIndicators[i].style('background-color', currentColors[i-1]); }

  push();
  let centerY = isMobile ? height / 2 - 25 : height / 2 + 20;
  translate(width / 2 + (isMobile ? 0 : 50), centerY);
  
  let design = designSelect.value();
  if (design === 'Rund') {
    const sector = buildSector();
    let scaleFactor = (min(width, height) / 900) * (isMobile ? 0.90 : 0.85);
    scale(scaleFactor);
    const sc = int(sektS.value());
    const angle = TWO_PI / sc;
    for (let i = 0; i < sc; i++) { push(); rotate(i * angle); drawSector(sector, currentColors); pop(); }
  } else if (design === 'Quadrat') {
    // Hier wird deine Quadrat-Logik gerendert
    scale((min(width, height) / 900) * 0.9);
    renderQuadrat(currentColors);
  } else if (design === 'Wabe') {
    scale((min(width, height) / 900) * 1.6);
    renderWabe(currentColors);
  }
  pop();

  if (logoImg && logoImg.width > 0) {
    push(); resetMatrix();
    let lW = isMobile ? 65 : 150;
    let lH = (logoImg.height / logoImg.width) * lW;
    let logoY = isMobile ? height - 165 : height - lH - 25;
    image(logoImg, 15, logoY, lW, lH); 
    pop();
  }
}

// --- DEINE 1:1 SEKTOREN-LOGIK ---

function buildSector() {
  const n = 16;
  let m = Array.from({length: n}, (_, r) => Array(r + 1).fill(0));
  let raw = (modeSelect.value() === 'Affirmation') ? codeFromAffirm(inputField.value()) : inputField.value().replace(/\D/g, "").split("").map(Number);
  while (raw.length < 8) raw.push(0);
  raw = raw.slice(0, 8);
  colorSeed = raw[0];
  if(codeDisplay) codeDisplay.html(raw.join(""));
  let frame = (richtungS.value() === "b") ? [...raw].reverse() : [...raw];
  const base = [...frame].reverse().concat(frame);
  for (let i = 0; i < 16; i++) m[15][i] = base[i];
  for (let i = 0; i < 16; i++) { let r = 15 - i; m[r][0] = base[i]; m[r][r] = base[i]; }
  for (let c = 1; c <= 13; c++) m[14][c] = ex(m[15][c], m[15][c + 1]);
  const c14 = (c, t) => t.forEach(([r, k]) => m[r][k] = m[14][c]);
  c14(1, [[2, 1]]); c14(2, [[3, 1], [3, 2], [13, 1], [13, 12]]); c14(3, [[4, 1], [4, 3], [12, 1], [12, 11]]);
  c14(4, [[5, 1], [5, 4], [11, 1], [11, 10]]); c14(5, [[6, 1], [6, 5], [10, 1], [10, 9]]);
  c14(6, [[7, 1], [7, 6], [9, 1], [9, 8]]); c14(7, [[8, 1], [8, 7]]);
  for (let c = 2; c <= 10; c++) m[13][c] = ex(m[14][c], m[14][c + 1]);
  const c13 = (c, t) => t.forEach(([r, k]) => m[r][k] = m[13][c]);
  c13(2, [[4, 2], [13, 11]]); c13(3, [[12, 2], [12, 10], [5, 2], [5, 3]]);
  c13(4, [[11, 2], [11, 9], [6, 4], [6, 2]]); c13(5, [[10, 2], [10, 8], [7, 5], [7, 2]]);
  c13(6, [[9, 2], [9, 7], [8, 6], [8, 2]]);
  for (let j = 3; j <= 8; j++) m[12][j] = ex(m[13][j], m[13][j+1]);
  const c12 = (c, t) => t.forEach(([r, k]) => m[r][k] = m[12][c]);
  c12(3, [[12, 9], [6, 3]]); c12(4, [[11, 3], [11, 8], [7, 4], [7, 3]]);
  c12(5, [[10, 3], [10, 7], [8, 5], [8, 3]]); c12(6, [[9, 3], [9, 6]]);
  m[11][4] = ex(m[12][4], m[12][5]); m[11][5] = ex(m[12][5], m[12][6]); m[11][6] = ex(m[12][6], m[12][7]);
  const c11 = (c, t) => t.forEach(([r, k]) => m[r][k] = m[11][c]);
  c11(4, [[11, 7], [8, 4]]); c11(5, [[10, 4], [10, 6], [9, 4], [9, 5]]);
  m[10][5] = ex(m[11][5], m[11][6]);
  return m;
}

function drawSector(m, colors, target) {
  let ctx = target || window;
  const step = 20;
  const sc = int(sektS.value());
  const angle = TWO_PI / sc;
  const h = tan(angle / 2) * step;
  ctx.stroke(0, 35); ctx.strokeWeight(0.5);
  for (let r = 0; r < m.length; r++) {
    for (let c = 0; c <= r; c++) {
      const v = m[r][c];
      const x = r * step; const y = (c - r / 2) * h * 2;
      if (v >= 1 && v <= 9) {
        let baseCol = color(colors[v - 1]);
        let sVal = sliders[v] ? sliders[v].value() : 85;
        ctx.fill(hue(baseCol), map(sVal, 20, 100, 15, saturation(baseCol)), map(sVal, 20, 100, 98, brightness(baseCol)));
      } else ctx.fill(255); 
      ctx.beginShape(); ctx.vertex(x, y); ctx.vertex(x + step, y - h); ctx.vertex(x + step * 2, y); ctx.vertex(x + step, y + h); ctx.endShape(CLOSE);
    }
  }
}

// --- Hilfsfunktionen ---

function codeFromAffirm(text) {
  let arr = []; text = text.toUpperCase().replace(/[^A-ZÄÖÜß]/g, "");
  for (let c of text) if (affirmMap[c]) arr.push(affirmMap[c]);
  while (arr.length > 8) {
    let n = []; for (let i = 0; i < arr.length - 1; i++) n.push(ex(arr[i], arr[i + 1]));
    arr = n;
  }
  while (arr.length < 8) arr.push(0);
  return arr.slice(0, 8);
}

function getColorMatrix(seed) {
  const s = (seed === 0 || !seed) ? 1 : seed;
  const shift = (s - 1) % 9;
  return baseColors.slice(shift).concat(baseColors.slice(0, shift));
}

function exportHighRes() {
  let exportW = 2480; let exportH = 3508; 
  let pg = createGraphics(exportW, exportH);
  pg.colorMode(HSB, 360, 100, 100); pg.background(255);
  const currentColors = getColorMatrix(colorSeed);
  const design = designSelect.value();
  pg.push();
  pg.translate(exportW / 2, exportH * 0.382); 
  if (design === 'Rund') {
    const sector = buildSector(); pg.scale(2.7);
    const sc = int(sektS.value()); const angle = TWO_PI / sc;
    for (let i = 0; i < sc; i++) { pg.push(); pg.rotate(i * angle); drawSector(sector, currentColors, pg); pg.pop(); }
  }
  // Hier Platzhalter für Quadrat/Wabe Export-Aufrufe
  pg.pop();
  if (logoImg) {
    pg.push(); pg.tint(255, 0.45);
    let wWidth = 350; let wHeight = (logoImg.height / logoImg.width) * wWidth;
    for (let x = -100; x < exportW; x += 450) { for (let y = -100; y < exportH; y += 450) { pg.image(logoImg, x, y, wWidth, wHeight); } }
    pg.pop();
    pg.push(); pg.noTint();
    let lW = 500; let lH = (logoImg.height / logoImg.width) * lW;
    pg.image(logoImg, exportW - lW - 100, exportH - lH - 100, lW, lH);
    pg.pop();
  }
  save(pg, 'Milz&More.png');
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); updateLayout(); redraw(); }

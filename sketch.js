// 1. GLOBALE VARIABLEN
var inputField, designSelect, modeSelect, dirSelect, sektSelect;
var sliders = [], colorIndicators = [], sliderPanel;
var logoImg, codeDisplay, isAdmin = false;
var qMatrix = [];

const charMap = {
  'A':1,'J':1,'S':1,'Ä':1,'B':2,'K':2,'T':2,'Ö':2,'C':3,'L':3,'U':3,'Ü':3,'D':4,'M':4,'V':4,'ß':4,
  'E':5,'N':5,'W':5,'F':6,'O':6,'X':6,'G':7,'P':7,'Y':7,'H':8,'Q':8,'Z':8,'I':9,'R':9
};

const baseColors = ["#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3"];

var ex = (a, b) => {
  let s = (a || 0) + (b || 0);
  return (s === 0) ? 0 : (s % 9 === 0 ? 9 : s % 9);
};

function preload() {
  // Vergewissere dich, dass logo.png im selben Ordner liegt
  logoImg = loadImage('logo.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  
  var params = getURLParams();
  if (params.access === 'milz_secret') isAdmin = true;
  var isMobile = windowWidth < 600;

  // TOPBAR
  var topBar = createDiv("").style('position', 'fixed').style('top', '0').style('left', '0').style('width', '100%')
    .style('background', '#2c3e50').style('color', '#fff').style('display', 'flex').style('padding', isMobile ? '4px 8px' : '10px 20px')
    .style('gap', isMobile ? '8px' : '20px').style('font-family', '"Inter", sans-serif').style('z-index', '200')
    .style('align-items', 'center').style('box-sizing', 'border-box').style('height', isMobile ? '55px' : '75px');

  function createUIGroup(labelTxt, element, wMobile, wDesktop) {
    var group = createDiv("").parent(topBar).style('display', 'flex').style('flex-direction', 'column').style('justify-content', 'center');
    createSpan(labelTxt).parent(group).style('font-size', isMobile ? '8px' : '10px').style('color', '#bdc3c7').style('text-transform', 'uppercase').style('font-weight', 'bold');
    if (element) {
      element.parent(group).style('width', isMobile ? wMobile : wDesktop)
        .style('font-size', isMobile ? '11px' : '13px').style('background', '#34495e').style('color', '#fff')
        .style('border', 'none').style('border-radius', '4px').style('height', isMobile ? '22px' : '30px');
    }
    return group;
  }

  designSelect = createSelect();
  ['Quadrat', 'Rund', 'Wabe'].forEach(d => designSelect.option(d));
  createUIGroup("DESIGN", designSelect, "70px", "100px");

  modeSelect = createSelect();
  modeSelect.option('Geburtstag'); modeSelect.option('Text');
  createUIGroup("MODUS", modeSelect, "80px", "110px");

  inputField = createInput('15011987');
  createUIGroup("EINGABE", inputField, "75px", "130px");

  sektSelect = createSelect();
  ["6","8","10","12"].forEach(s => sektSelect.option(s)); sektSelect.selected("8");
  createUIGroup("SEK", sektSelect, "35px", "50px");

  dirSelect = createSelect();
  dirSelect.option('Außen'); dirSelect.option('Innen');
  createUIGroup("DIR", dirSelect, "60px", "80px");

  var saveBtn = createButton('DOWNLOAD').parent(topBar)
    .style('margin-left', 'auto').style('background', '#fff').style('border', 'none').style('font-weight', 'bold')
    .style('border-radius', '4px').style('padding', '5px 10px').style('cursor', 'pointer');
  saveBtn.mousePressed(exportHighRes);

  // SLIDER PANEL INITIALISIERUNG
  sliderPanel = createDiv("").style('position', 'fixed').style('background', 'rgba(44, 62, 80, 0.95)').style('z-index', '150');
  for (var i = 1; i <= 9; i++) {
    var sRow = createDiv("").parent(sliderPanel).style('display','flex').style('align-items','center').style('gap','5px');
    colorIndicators[i] = createDiv("").parent(sRow).style('width', '10px').style('height', '10px').style('border-radius', '50%');
    sliders[i] = createSlider(20, 100, 85).parent(sRow).input(() => redraw());
  }

  updateLayout();
  [designSelect, modeSelect, dirSelect, sektSelect, inputField].forEach(e => {
    if(e.changed) e.changed(() => redraw());
  });
  inputField.input(() => redraw());
}

function updateLayout() {
  var isMobile = windowWidth < 600;
  if (isMobile) {
    sliderPanel.style('top', 'auto').style('bottom', '0').style('left', '0').style('width', '100%')
      .style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)').style('padding', '10px 5px');
    for (var i = 1; i <= 9; i++) sliders[i].style('width', '75px');
  } else {
    sliderPanel.style('bottom', 'auto').style('top', '90px').style('left', '0').style('width', 'auto')
      .style('display', 'flex').style('flex-direction', 'column').style('padding', '15px').style('border-radius', '0 10px 10px 0');
    for (var i = 1; i <= 9; i++) sliders[i].style('width', '80px');
  }
}

function draw() {
  background(255);
  var isMobile = windowWidth < 600;
  var code = getCode();
  if (!code || code.length < 8) return;

  var startDigit = code[0] || 1;
  var currentColors = getColorSet(startDigit);
  
  for (var i = 1; i <= 9; i++) {
    if(colorIndicators[i]) colorIndicators[i].style('background-color', currentColors[i-1]);
  }

  push();
  var centerY = isMobile ? height / 2 - 40 : height / 2 + 20;
  translate(width / 2, centerY);
  
  let design = designSelect.value();
  if (design === 'Quadrat') {
    scale((min(width, height) / 850) * (isMobile ? 0.8 : 0.95));
    let drawCode = dirSelect.value() === 'Innen' ? [...code].reverse() : code;
    calcQuadratMatrix(drawCode);
    drawQuadrat(currentColors);
  } else if (design === 'Rund') {
    scale((min(width, height) / 900) * (isMobile ? 0.85 : 0.95));
    drawRund(code, currentColors);
  } else if (design === 'Wabe') {
    scale((min(width, height) / 520) * (isMobile ? 0.45 : 0.48));
    drawWabe(code, currentColors);
  }
  pop();

  if (logoImg && logoImg.width > 0) {
    let lW = isMobile ? 60 : 150;
    let lH = (logoImg.height / logoImg.width) * lW;
    image(logoImg, 20, height - (isMobile ? 130 : lH + 20), lW, lH);
  }
}

// --- ZEICHEN-FUNKTIONEN ---

function drawQuadrat(colors, target) {
  var ctx = target || window;
  var ts = 16;
  ctx.stroke(0, 30); ctx.strokeWeight(0.5);
  for (var r = 0; r < 20; r++) {
    for (var c = 0; c < 20; c++) {
      var val = qMatrix[r][c];
      if (val > 0) {
        ctx.fill(getSliderColor(colors[val-1], val));
        ctx.rect(c*ts, -(r+1)*ts, ts, ts); ctx.rect(-(c+1)*ts, -(r+1)*ts, ts, ts);
        ctx.rect(c*ts, r*ts, ts, ts); ctx.rect(-(c+1)*ts, r*ts, ts, ts);
      }
    }
  }
}

function drawRund(code, colors, target) {
  var ctx = target || window;
  var sc = int(sektSelect.value());
  var angle = TWO_PI / sc;
  var sectorData = buildRundSector(code);
  for (var i = 0; i < sc; i++) {
    ctx.push(); ctx.rotate(i * angle);
    let step = 20; let h = tan(angle/2) * step;
    ctx.stroke(0, 30); ctx.strokeWeight(0.5);
    for (var r = 0; r < sectorData.length; r++) {
      for (var c = 0; c <= r; c++) {
        var v = sectorData[r][c];
        if (v > 0) {
          ctx.fill(getSliderColor(colors[v-1], v));
          let x = r * step; let y = (c - r/2) * h * 2;
          ctx.beginShape(); ctx.vertex(x,y); ctx.vertex(x+step, y-h); ctx.vertex(x+step*2, y); ctx.vertex(x+step, y+h); ctx.endShape(CLOSE);
        }
      }
    }
    ctx.pop();
  }
}

function drawWabe(code, colors, target) {
  var ctx = target || window;
  var sz = 16.2;
  var path = dirSelect.value() === 'Innen' ? [...code, ...[...code].reverse()] : [...[...code].reverse(), ...code];
  ctx.stroke(0, 30); ctx.strokeWeight(0.5);
  for (var s = 0; s < 6; s++) {
    ctx.push(); ctx.rotate(s * PI / 3);
    var m = Array(17).fill().map(() => Array(17).fill(0));
    for (var i = 0; i < 16; i++) m[16][i] = path[i % path.length];
    for (var r = 15; r >= 1; r--) for (var i = 0; i < r; i++) m[r][i] = ex(m[r+1][i], m[r+1][i+1]);
    for (var r = 1; r <= 16; r++) {
      for (var i = 0; i < r; i++) {
        if (m[r][i] > 0) {
          ctx.fill(getSliderColor(colors[m[r][i]-1], m[r][i]));
          let x = (i - (r-1)/2) * sz * sqrt(3), y = -(r-1) * sz * 1.5;
          ctx.beginShape(); for (let a = PI/6; a < TWO_PI; a += PI/3) ctx.vertex(x + cos(a)*sz, y + sin(a)*sz); ctx.endShape(CLOSE);
        }
      }
    }
    ctx.pop();
  }
}

// --- HELFER-FUNKTIONEN ---

function getSliderColor(cStr, val) {
  let col = color(cStr);
  let sVal = (sliders[val]) ? sliders[val].value() : 85;
  return color(hue(col), map(sVal, 20, 100, 15, saturation(col)), map(sVal, 20, 100, 98, brightness(col)));
}

function getColorSet(seed) {
  let shift = (seed - 1) % 9;
  return baseColors.slice(shift).concat(baseColors.slice(0, shift));
}

function getCode() {
  let val = inputField.value().toUpperCase();
  if (modeSelect.value() === 'Geburtstag') {
    let d = val.replace(/\D/g, "").split("").map(Number);
    while(d.length < 8) d.push(0);
    return d.slice(0, 8);
  } else {
    let chars = val.replace(/[^A-ZÄÖÜß]/g, "").split("").map(c => charMap[c] || 0);
    if (chars.length === 0) return [1,1,1,1,1,1,1,1];
    let row = chars;
    while(row.length < 8) row.push(9);
    while(row.length > 8) {
      let next = [];
      for (let i=0; i<row.length-1; i++) next.push(ex(row[i], row[i+1]));
      row = next;
    }
    return row;
  }
}

function calcQuadratMatrix(code) {
  qMatrix = Array(20).fill().map(() => Array(20).fill(0));
  let d = [code[0], code[1]], m = [code[2], code[3]], j1 = [code[4], code[5]], j2 = [code[6], code[7]];
  function set2(r, c, v1, v2) { 
    if (r < 19 && c < 19) { qMatrix[r][c] = v1; qMatrix[r][c+1] = v2; qMatrix[r+1][c] = v2; qMatrix[r+1][c+1] = v1; }
  }
  for(let i=0; i<8; i+=2) set2(i, i, d[0], d[1]);
  for(let i=0; i<6; i+=2) { set2(i, i+2, m[0], m[1]); set2(i+2, i, m[0], m[1]); }
  for(let i=0; i<4; i+=2) { set2(i, i+4, j1[0], j1[1]); set2(i+4, i, j1[0], j1[1]); }
  set2(0, 6, j2[0], j2[1]); set2(6, 0, j2[0], j2[1]);
  for(let r=0; r<8; r++) for(let c=8; c<20; c++) qMatrix[r][c] = ex(qMatrix[r][c-2], qMatrix[r][c-1]);
  for(let c=0; c<20; c++) for(let r=8; r<20; r++) qMatrix[r][c] = ex(qMatrix[r-2][c], qMatrix[r-1][c]);
}

function buildRundSector(code) {
  let n = 16; let m = Array.from({length: n}, (_, r) => Array(r + 1).fill(0));
  let frame = dirSelect.value() === 'Innen' ? [...code].reverse() : [...code];
  let base = [...frame].reverse().concat(frame);
  for (let i=0; i<16; i++) { m[15][i] = base[i]; m[i][0] = base[i]; m[i][i] = base[i]; }
  for (let r=14; r>=0; r--) for (let c=1; c<r; c++) m[r][c] = ex(m[r+1][c], m[r+1][c+1]);
  return m;
}

function exportHighRes() {
  let pg = createGraphics(2480, 3508);
  pg.colorMode(HSB, 360, 100, 100); pg.background(255);
  let code = getCode();
  let colors = getColorSet(code[0] || 1);
  let design = designSelect.value();
  
  pg.push();
  pg.translate(pg.width/2, pg.height * 0.42);
  if (design === 'Quadrat') { 
    pg.scale(3.8); 
    let drawCode = dirSelect.value() === 'Innen' ? [...code].reverse() : code;
    calcQuadratMatrix(drawCode); 
    drawQuadrat(colors, pg); 
  }
  else if (design === 'Rund') { pg.scale(3.2); drawRund(code, colors, pg); }
  else { pg.scale(2.4); drawWabe(code, colors, pg); }
  pg.pop();

  if (logoImg) {
    if (!isAdmin) {
      pg.tint(255, 0.2);
      for(let x=0; x<pg.width; x+=500) for(let y=0; y<pg.height; y+=500) pg.image(logoImg, x, y, 400, 400 * (logoImg.height/logoImg.width));
      pg.noTint();
    }
    let lW = 500; let lH = (logoImg.height/logoImg.width) * lW;
    pg.image(logoImg, pg.width - lW - 100, pg.height - lH - 100, lW, lH);
  }
  save(pg, `MilzMore_${design}_${inputField.value()}.png`);
}

function windowResized() { 
  resizeCanvas(windowWidth, windowHeight); 
  updateLayout(); 
  redraw(); 
}

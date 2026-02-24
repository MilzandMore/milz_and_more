// 1. GLOBALE VARIABLEN
var inputField, modeSelect, dirSelect, sliders = [], colorIndicators = [], sliderPanel;
var qMatrix = [];
var logoImg;
var codeDisplay; 
var isAdmin = false;

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

function preload() { 
    // Pfad für die Studio-Struktur angepasst
    logoImg = loadImage('/assets/Logo.png'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  var params = getURLParams();
  if (params.access === 'milz_secret') isAdmin = true;

  var isMobile = windowWidth < 600;


  function createUIGroup(labelTxt, element, wMobile, wDesktop) {
    var group = createDiv("").parent(topBar).style('display', 'flex').style('flex-direction', 'column').style('justify-content', 'center');
    createSpan(labelTxt).parent(group).style('font-size', isMobile ? '8px' : '10px').style('color', '#888').style('text-transform', 'uppercase').style('font-weight', 'bold').style('margin-bottom', '2px');
    if (element) {
      element.parent(group).style('width', isMobile ? wMobile : wDesktop)
        .style('font-size', isMobile ? '11px' : '13px').style('background', '#333').style('color', '#fff')
        .style('border', '1px solid #444').style('border-radius', '4px').style('padding', isMobile ? '3px 5px' : '6px 8px')
        .style('height', isMobile ? '22px' : '32px');
    }
    return group;
  }

  modeSelect = createSelect(); modeSelect.option('Geburtstag'); modeSelect.option('Text');
  createUIGroup("MODUS", modeSelect, "80px", "110px");
  
  inputField = createInput('15011987');
  createUIGroup("EINGABE", inputField, "75px", "140px");
  
  var codeGroup = createUIGroup("CODE", null, "auto", "auto");
  codeDisplay = createSpan("").parent(codeGroup).style('font-size', isMobile ? '11px' : '14px').style('color', '#00d1b2').style('font-weight', '600').style('letter-spacing', '1px');

  dirSelect = createSelect(); dirSelect.option('Außen'); dirSelect.option('Innen');
  createUIGroup("RICHTUNG", dirSelect, "65px", "100px");

  var saveBtn = createButton('DOWNLOAD').parent(topBar)
   .style('margin-left', 'auto').style('background', '#00d1b2').style('color', '#fff')
   .style('border', 'none').style('font-weight', 'bold').style('border-radius', '4px')
   .style('padding', isMobile ? '6px 8px' : '10px 16px').style('font-size', isMobile ? '9px' : '12px').style('cursor', 'pointer');
  saveBtn.mousePressed(exportHighRes);

  sliderPanel = createDiv("").style('position', 'fixed').style('background', 'rgba(20, 20, 20, 0.95)').style('z-index', '150').style('border', '1px solid #333');
  for (var i = 1; i <= 9; i++) {
    var sRow = createDiv("").parent(sliderPanel).style('display','flex').style('align-items','center').style('gap','8px').style('margin-bottom','4px');
    colorIndicators[i] = createDiv("").parent(sRow).style('width', '12px').style('height', '12px').style('border-radius', '50%');
    sliders[i] = createSlider(20, 100, 85).parent(sRow).input(() => redraw());
  }

  updateLayout();
  [modeSelect, dirSelect, inputField].forEach(e => e.input ? e.input(() => redraw()) : e.changed(() => redraw()));
}

function updateLayout() {
  var isMobile = windowWidth < 600;
  if (isMobile) {
    sliderPanel.style('top', 'auto').style('bottom', '0').style('left', '0').style('width', '100%')
      .style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)').style('padding', '10px').style('gap', '10px');
    for (var i = 1; i <= 9; i++) if(sliders[i]) sliders[i].style('width', '75px');
  } else {
    sliderPanel.style('bottom', 'auto').style('top', '100px').style('right', '20px').style('width', 'auto')
      .style('display', 'flex').style('flex-direction', 'column').style('padding', '15px').style('border-radius', '8px');
    for (var i = 1; i <= 9; i++) if(sliders[i]) sliders[i].style('width', '120px');
  }
}

function draw() {
  var isMobile = windowWidth < 600;
  var rawVal = inputField.value().trim();
  if (rawVal === "") { background(26); return; }

  background(26); // Dunkler Studio Hintergrund
  var baseCode = (modeSelect.value().includes('Geburtstag')) ? getCodeFromDate() : getCodeFromText();
  var startDigit = baseCode[0] || 1;
  var drawCode = (dirSelect.value().includes('Innen')) ? [...baseCode].reverse() : baseCode;
  
  if(codeDisplay) codeDisplay.html(baseCode.join(""));

  for (var i = 1; i <= 9; i++) {
    var hex = (colorMatrix[startDigit] && colorMatrix[startDigit][i]) ? colorMatrix[startDigit][i] : mapZ[i];
    if(colorIndicators[i]) colorIndicators[i].style('background-color', hex);
  }
  
  push();
  var scaleFactor = (min(width, height) / 850) * (isMobile ? 0.70 : 0.90);
  var centerY = isMobile ? height / 2 - 60 : height / 2 + 20;
  var centerX = width / 2; 
  
  translate(centerX, centerY);
  scale(scaleFactor);
  
  calcQuadratMatrix(drawCode); 
  drawQuadrat(startDigit);
  pop();

  if (logoImg && logoImg.width > 0) {
    push(); resetMatrix();
    var lW = isMobile ? 80 : 150;
    var lH = (logoImg.height / logoImg.width) * lW;
    image(logoImg, 20, height - lH - (isMobile ? 120 : 20), lW, lH); 
    pop();
  }
}

function drawQuadrat(startDigit, target) {
  var ctx = target || window;
  var ts = 16;
  ctx.stroke(0, 50);
  ctx.strokeWeight(0.5);
  for (var r = 0; r < 20; r++) {
    for (var c = 0; c < 20; c++) {
      var val = qMatrix[r][c];
      if (val !== 0) {
        var hex = (colorMatrix[startDigit] && colorMatrix[startDigit][val]) ? colorMatrix[startDigit][val] : mapZ[val];
        var col = color(hex);
        var sVal = sliders[val] ? sliders[val].value() : 85;
        ctx.fill(hue(col), map(sVal, 20, 100, 15, saturation(col)), map(sVal, 20, 100, 98, brightness(col)));
        ctx.rect(c * ts, -(r + 1) * ts, ts, ts); ctx.rect(-(c + 1) * ts, -(r + 1) * ts, ts, ts); 
        ctx.rect(c * ts, r * ts, ts, ts); ctx.rect(-(c + 1) * ts, r * ts, ts, ts);                
      }
    }
  }
}

function exportHighRes() {
  var exportW = 2480; var exportH = 3508;
  var pg = createGraphics(exportW, exportH);
  pg.colorMode(HSB, 360, 100, 100); pg.background(255);
  var baseCode = (modeSelect.value().includes('Geburtstag')) ? getCodeFromDate() : getCodeFromText();
  var startDigit = baseCode[0] || 1;
  var drawCode = (dirSelect.value().includes('Innen')) ? [...baseCode].reverse() : baseCode;
  pg.push(); 
  pg.translate(exportW / 2, exportH * 0.45); 
  pg.scale(4.5); 
  calcQuadratMatrix(drawCode); 
  drawQuadrat(startDigit, pg); 
  pg.pop();

  if (logoImg) {
    var lW = 500; var lH = (logoImg.height / logoImg.width) * lW;
    pg.image(logoImg, exportW - lW - 100, exportH - lH - 100, lW, lH);
  }
  save(pg, 'Lebenscode_Quadrat.png');
}

function getCodeFromDate() { var val = inputField.value().replace(/[^0-9]/g, ""); var res = val.split('').map(Number); while (res.length < 8) res.push(0); return res.slice(0, 8); }
function getCodeFromText() { 
  var textStr = inputField.value().toUpperCase().replace(/[^A-ZÄÖÜß]/g, ""); if (textStr.length === 0) return [1,1,1,1,1,1,1,1];
  var firstRow = [];
  for (var char of textStr) { if (charMap[char]) firstRow.push(charMap[char]); }
  var currentRow = firstRow; while(currentRow.length < 8) currentRow.push(9);
  while (currentRow.length > 8) { var nextRow = []; for (var i = 0; i < currentRow.length - 1; i++) { var sum = currentRow[i] + currentRow[i+1]; nextRow.push(sum % 9 === 0 ? 9 : sum % 9); } currentRow = nextRow; }
  return currentRow;
}
function ex(a, b) { var s = (a || 0) + (b || 0); return (s === 0) ? 0 : (s % 9 === 0 ? 9 : s % 9); }
function calcQuadratMatrix(code) {
  qMatrix = Array(20).fill().map(() => Array(20).fill(0));
  var d = [code[0], code[1]], m = [code[2], code[3]], j1 = [code[4], code[5]], j2 = [code[6], code[7]];
  function set2(r, c, v1, v2) { if (r >= 20 || c >= 20) return; qMatrix[r][c] = v1; if(c+1 < 20) qMatrix[r][c+1] = v2; if(r+1 < 20) qMatrix[r+1][c] = v2; if(r+1 < 20 && c+1 < 20) qMatrix[r+1][c+1] = v1; }
  for(var i = 0; i < 8; i+=2) set2(i, i, d[0], d[1]);
  for(var i = 0; i < 6; i+=2) { set2(i, i+2, m[0], m[1]); set2(i+2, i, m[0], m[1]); }
  for(var i = 0; i < 4; i+=2) { set2(i, i+4, j1[0], j1[1]); set2(i+4, i, j1[0], j1[1]); }
  set2(0, 6, j2[0], j2[1]); set2(6, 0, j2[0], j2[1]);
  for(var r = 0; r < 8; r++) { for(var c = 8; c < 20; c++) qMatrix[r][c] = ex(qMatrix[r][c-2], qMatrix[r][c-1]); }
  for(var c = 0; c < 20; c++) { for(var r = 8; r < 20; r++) qMatrix[r][c] = ex(qMatrix[r-2][c], qMatrix[r-1][c]); }
}
function windowResized() { resizeCanvas(windowWidth, windowHeight); updateLayout(); redraw(); }

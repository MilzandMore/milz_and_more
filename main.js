var inputField, modeSelect, shapeSelect, dirS, sektS, codeDisplay, sliders = [], colorIndicators = [], sliderPanel;
var logoImg, isAdmin = false;

var charMap = { 'A':1,'J':1,'S':1,'Ä':1,'B':2,'K':2,'T':2,'Ö':2,'C':3,'L':3,'U':3,'Ü':3,'D':4,'M':4,'V':4,'ß':4,'E':5,'N':5,'W':5,'F':6,'O':6,'X':6,'G':7,'P':7,'Y':7,'H':8,'Q':8,'Z':8,'I':9,'R':9 };

function preload() { logoImg = loadImage('logo.png'); }

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  var params = getURLParams();
  if (params.access === 'milz_secret') isAdmin = true;
  var isMobile = windowWidth < 600;

  var topBar = createDiv("").style('position', 'fixed').style('top', '0').style('left', '0').style('width', '100%')
    .style('background', '#2c3e50').style('color', '#fff').style('display', 'flex').style('padding', isMobile ? '4px 8px' : '10px 20px')
    .style('gap', isMobile ? '8px' : '20px').style('font-family', '"Inter", sans-serif').style('z-index', '200')
    .style('align-items', 'center').style('box-sizing', 'border-box').style('height', isMobile ? '55px' : '75px');

  function createUIGroup(labelTxt, element, wMobile, wDesktop) {
    var group = createDiv("").parent(topBar).style('display', 'flex').style('flex-direction', 'column').style('justify-content', 'center');
    createSpan(labelTxt).parent(group).style('font-size', isMobile ? '8px' : '10px').style('color', '#bdc3c7').style('text-transform', 'uppercase').style('font-weight', 'bold').style('margin-bottom', '2px');
    if (element) {
      element.parent(group).style('width', isMobile ? wMobile : wDesktop).style('font-size', isMobile ? '11px' : '13px').style('background', '#34495e').style('color', '#fff').style('border', 'none').style('border-radius', '4px').style('padding', isMobile ? '3px 5px' : '6px 8px').style('height', isMobile ? '22px' : '32px');
    }
    return group;
  }

  shapeSelect = createSelect(); shapeSelect.option('Quadrat'); shapeSelect.option('Rund'); shapeSelect.option('Wabe');
  createUIGroup("FORM", shapeSelect, "80px", "110px");

  modeSelect = createSelect(); modeSelect.option('Geburtstag'); modeSelect.option('Text');
  createUIGroup("MODUS", modeSelect, "80px", "110px");

  inputField = createInput('15011987');
  createUIGroup("EINGABE", inputField, "75px", "140px");

  var codeGroup = createUIGroup("CODE", null, "auto", "auto");
  codeDisplay = createSpan("").parent(codeGroup).style('font-size', isMobile ? '11px' : '14px').style('color', '#ffffff');

  sektS = createSelect(); ["6","8","10","12","13"].forEach(s => sektS.option(s)); sektS.selected("8");
  createUIGroup("SEKTOR", sektS, "40px", "60px");

  dirS = createSelect(); dirS.option('Außen'); dirS.option('Innen');
  createUIGroup("RICHTUNG", dirS, "65px", "100px");

  var saveBtn = createButton('DOWNLOAD').parent(topBar).style('margin-left', 'auto').style('background', '#ffffff').style('color', '#2c3e50').style('border', 'none').style('font-weight', 'bold').style('border-radius', '4px').style('padding', isMobile ? '6px 8px' : '10px 16px').style('font-size', isMobile ? '9px' : '12px').style('cursor', 'pointer');
  saveBtn.mousePressed(exportHighRes);

  sliderPanel = createDiv("").style('position', 'fixed').style('background', 'rgba(44, 62, 80, 0.98)').style('z-index', '150');
  for (var i = 1; i <= 9; i++) {
    var sRow = createDiv("").parent(sliderPanel).style('display','flex').style('align-items','center').style('gap','4px');
    colorIndicators[i] = createDiv("").parent(sRow).style('width', '8px').style('height', '8px').style('border-radius', '50%');
    sliders[i] = createSlider(20, 100, 85).parent(sRow).input(() => redraw());
  }

  updateLayout();
  [shapeSelect, modeSelect, inputField, sektS, dirS].forEach(e => e.changed(redraw));
  inputField.input(redraw);
}

function updateLayout() {
  var isMobile = windowWidth < 600;
  if (isMobile) {
    sliderPanel.style('top', 'auto').style('bottom', '0').style('left', '0').style('width', '100%').style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)').style('padding', '8px 4px').style('gap', '4px');
    for (var i = 1; i <= 9; i++) if(sliders[i]) sliders[i].style('width', '75px');
  } else {
    sliderPanel.style('bottom', 'auto').style('top', '90px').style('left', '0').style('width', 'auto').style('display', 'flex').style('flex-direction', 'column').style('padding', '12px').style('border-radius', '0 8px 8px 0');
    for (var i = 1; i <= 9; i++) if(sliders[i]) sliders[i].style('width', '80px');
  }
}

function draw() {
  background(255);
  var isMobile = windowWidth < 600;
  var baseCode = getCode();
  var startDigit = baseCode[0] || 1;
  var drawCode = (dirS.value().includes('Innen')) ? [...baseCode].reverse() : baseCode;
  if(codeDisplay) codeDisplay.html(baseCode.join(""));

  if (shapeSelect.value() === 'Rund') sektS.parent().show(); else sektS.parent().hide();

  push();
  var scaleF = (min(width, height) / 850) * (isMobile ? 0.8 : 0.95);
  translate(width / 2, isMobile ? height / 2 - 40 : height / 2 + 20);
  scale(scaleF);

  if (shapeSelect.value() === 'Quadrat') renderQuadrat(drawCode, startDigit);
  else if (shapeSelect.value() === 'Rund') renderRund(drawCode, startDigit);
  else renderWabe(drawCode, startDigit);
  pop();

  if (logoImg && logoImg.width > 0) {
    push(); resetMatrix();
    var lW = isMobile ? 55 : 150; var lH = (logoImg.height / logoImg.width) * lW;
    image(logoImg, 15, isMobile ? height - 125 : height - lH - 25, lW, lH);
    pop();
  }
}

function getCode() {
  var val = inputField.value();
  if (modeSelect.value() === 'Geburtstag') {
    var res = val.replace(/[^0-9]/g, "").split('').map(Number);
    while (res.length < 8) res.push(0); return res.slice(0, 8);
  } else {
    var textStr = val.toUpperCase().replace(/[^A-ZÄÖÜß]/g, ""); if (textStr.length === 0) return [1,1,1,1,1,1,1,1];
    var row = textStr.split("").map(c => charMap[c]);
    while(row.length < 8) row.push(9);
    var ex = (a, b) => { var s = a + b; return s % 9 === 0 ? 9 : s % 9; };
    while (row.length > 8) { var next = []; for (var i = 0; i < row.length - 1; i++) next.push(ex(row[i], row[i+1])); row = next; }
    return row;
  }
}

function exportHighRes() {
  var pg = createGraphics(2480, 3508); pg.colorMode(HSB, 360, 100, 100); pg.background(255);
  var baseCode = getCode(); var startDigit = baseCode[0] || 1;
  var drawCode = (dirS.value().includes('Innen')) ? [...baseCode].reverse() : baseCode;
  pg.push(); pg.translate(1240, 1400); pg.scale(3.8);
  if (shapeSelect.value() === 'Quadrat') renderQuadrat(drawCode, startDigit, pg);
  else if (shapeSelect.value() === 'Rund') renderRund(drawCode, startDigit, pg);
  else renderWabe(drawCode, startDigit, pg);
  pg.pop();

  if (logoImg && !isAdmin) {
    pg.tint(255, 0.45); var wW = 380; var wH = (logoImg.height / logoImg.width) * wW;
    for (var x = -100; x < 2500; x += 500) for (var y = -100; y < 3600; y += 500) pg.image(logoImg, x, y, wW, wH);
  }
  if (logoImg) pg.image(logoImg, 1880, 3300, 500, (logoImg.height / logoImg.width) * 500);
  save(pg, 'Milz_Mandala.png');
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); updateLayout(); }



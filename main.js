var inputField, modeSelect, shapeSelect, dirS, sektS, codeDisplay, sliders = [], sliderPanel;
var logoImg, isAdmin = false;
var sektGroup; // Variable für die Sektor-Gruppe

var charMap = { 'A':1,'J':1,'S':1,'Ä':1,'B':2,'K':2,'T':2,'Ö':2,'C':3,'L':3,'U':3,'Ü':3,'D':4,'M':4,'V':4,'ß':4,'E':5,'N':5,'W':5,'F':6,'O':6,'X':6,'G':7,'P':7,'Y':7,'H':8,'Q':8,'Z':8,'I':9,'R':9 };

function preload() { 
  // Versuche das Logo zu laden, falls vorhanden
  logoImg = loadImage('logo.png', () => {}, () => console.log("Logo nicht gefunden - fahre ohne Logo fort.")); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  var params = getURLParams();
  if (params.access === 'milz_secret') isAdmin = true;
  setupUI();
  updateLayout();
  noLoop(); // Nur neu zeichnen bei Input
}

function setupUI() {
  var isMobile = windowWidth < 600;
  var topBar = createDiv("").style('position', 'fixed').style('top', '0').style('left', '0').style('width', '100%')
    .style('background', '#2c3e50').style('color', '#fff').style('display', 'flex').style('padding', isMobile ? '4px 8px' : '10px 20px')
    .style('gap', isMobile ? '8px' : '20px').style('z-index', '200').style('align-items', 'center').style('box-sizing', 'border-box').style('height', isMobile ? '55px' : '75px');

  function createUIGroup(labelTxt, element, wMobile, wDesktop) {
    var group = createDiv("").parent(topBar).style('display', 'flex').style('flex-direction', 'column').style('justify-content', 'center');
    createSpan(labelTxt).parent(group).style('font-size', isMobile ? '8px' : '10px').style('color', '#bdc3c7').style('font-weight', 'bold');
    if (element) {
      element.parent(group).style('width', isMobile ? wMobile : wDesktop).style('background', '#34495e').style('color', '#fff').style('border', 'none').style('border-radius', '4px').style('height', isMobile ? '22px' : '32px');
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
  codeDisplay = createSpan("").parent(codeGroup).style('color', '#fff').style('font-family', 'monospace');
  
  sektS = createSelect(); ["6","8","10","12","13"].forEach(s => sektS.option(s)); sektS.selected("8");
  sektGroup = createUIGroup("SEKTOR", sektS, "40px", "60px");
  
  dirS = createSelect(); dirS.option('Außen'); dirS.option('Innen');
  createUIGroup("RICHTUNG", dirS, "65px", "100px");

  var saveBtn = createButton('DOWNLOAD').parent(topBar).style('background', '#fff').style('border', 'none').style('padding', '5px 10px').style('border-radius', '4px').style('cursor', 'pointer').style('font-weight', 'bold');
  saveBtn.mousePressed(exportHighRes);

  sliderPanel = createDiv("").style('position', 'fixed').style('background', 'rgba(44, 62, 80, 0.95)').style('z-index', '150');
  for (var i = 1; i <= 9; i++) {
    var sRow = createDiv("").parent(sliderPanel).style('display','flex').style('align-items','center').style('padding','2px');
    sliders[i] = createSlider(20, 100, 85).parent(sRow).input(() => redraw());
  }
  
  [shapeSelect, modeSelect, inputField, sektS, dirS].forEach(e => e.changed(() => redraw()));
  inputField.input(() => redraw());
}

function updateLayout() {
  var isMobile = windowWidth < 600;
  if (isMobile) {
    sliderPanel.style('bottom', '0').style('top', 'auto').style('left', '0').style('width', '100%').style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)');
    for (var i = 1; i <= 9; i++) sliders[i].style('width', '75px');
  } else {
    sliderPanel.style('top', '90px').style('bottom', 'auto').style('left', '0').style('width', 'auto').style('display', 'block').style('padding', '10px');
    for (var i = 1; i <= 9; i++) sliders[i].style('width', '80px');
  }
}

function draw() {
  background(255);
  var isMobile = windowWidth < 600;
  var baseCode = getCode();
  var startDigit = baseCode[0] || 1;
  var drawCode = (dirS.value().includes('Innen')) ? [...baseCode].reverse() : baseCode;
  
  if(codeDisplay) codeDisplay.html(baseCode.join(""));
  
  // Sichtbarkeit des Sektor-Menüs steuern (nur bei Rund)
  if (shapeSelect.value() === 'Rund') {
    sektGroup.style('display', 'flex');
  } else {
    sektGroup.style('display', 'none');
  }

  push();
  translate(width/2, height/2 + 20);
  var sc = (min(width, height) / 900) * (isMobile ? 0.7 : 0.9);
  scale(sc);
  
  if (shapeSelect.value() === 'Quadrat') renderQuadrat(drawCode, startDigit);
  else if (shapeSelect.value() === 'Rund') renderRund(drawCode, startDigit);
  else renderWabe(drawCode, startDigit);
  pop();

  if (logoImg && logoImg.width > 0) {
    image(logoImg, 20, height - 80, 100, 100 * (logoImg.height / logoImg.width));
  }
}

function getCode() {
  var val = inputField.value();
  if (modeSelect.value() === 'Geburtstag') {
    var res = val.replace(/[^0-9]/g, "").split('').map(Number);
    while (res.length < 8) res.push(0); return res.slice(0, 8);
  } else {
    var textStr = val.toUpperCase().replace(/[^A-ZÄÖÜß]/g, ""); 
    if (textStr.length === 0) return [1,1,1,1,1,1,1,1];
    var row = textStr.split("").map(c => charMap[c] || 1);
    while(row.length < 8) row.push(9);
    var ex = (a, b) => { var s = a + b; return s % 9 === 0 ? 9 : s % 9; };
    while (row.length > 8) { 
      var next = []; 
      for (var i = 0; i < row.length - 1; i++) next.push(ex(row[i], row[i+1])); 
      row = next; 
    }
    return row;
  }
}

function exportHighRes() {
  saveCanvas('Mandala_' + inputField.value(), 'png');
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); updateLayout(); redraw(); }

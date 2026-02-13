// ==========================================
// 1. GLOBALE VARIABLEN (NUR HIER!)
// ==========================================
var baseColors = ["#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3"];
var affirmMap = { 
  A:1,J:1,S:1,Ä:1, B:2,K:2,T:2,Ö:2, C:3,L:3,U:3,Ü:3, D:4,M:4,V:4,ß:4, 
  E:5,N:5,W:5, F:6,O:6,X:6, G:7,P:7,Y:7, H:8,Q:8,Z:8, I:9,R:9 
};
var ex = (a,b) => (a + b) % 9 === 0 ? 9 : (a + b) % 9;

var modeSelect, inputField, codeDisplay, sektS, richtungS, sliders = [], colorIndicators = [], sliderPanel;
logoImg;
var colorSeed = 1;
var isAdmin = false;

// ==========================================
// 2. SETUP & PRELOAD
// ==========================================
function preload() {
  logoImg = loadImage('logo.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  
  var params = getURLParams();
  if (params.access === 'milz_secret') isAdmin = true;

  var isMobile = windowWidth < 600;

  // TOPBAR FIX: Position 'relative' oder fester Abstand, damit sie nichts überlappt
  var topBar = createDiv("").style('position', 'fixed').style('top', '0').style('left', '0').style('width', '100%')
    .style('background', '#2c3e50').style('color', '#fff').style('display', 'flex').style('padding', isMobile ? '4px 8px' : '10px 20px')
    .style('gap', isMobile ? '8px' : '20px').style('font-family', '"Inter", sans-serif').style('z-index', '200')
    .style('align-items', 'center').style('box-sizing', 'border-box').style('height', isMobile ? '55px' : '75px');

  function createUIGroup(labelTxt, element, wMobile, wDesktop) {
    var group = createDiv("").parent(topBar).style('display', 'flex').style('flex-direction', 'column').style('justify-content', 'center');
    createSpan(labelTxt).parent(group).style('font-size', isMobile ? '8px' : '10px').style('color', '#bdc3c7').style('text-transform', 'uppercase').style('font-weight', 'bold').style('margin-bottom', '2px');
    if (element) {
      element.parent(group).style('width', isMobile ? wMobile : wDesktop)
        .style('font-size', isMobile ? '11px' : '13px').style('background', '#34495e').style('color', '#fff')
        .style('border', 'none').style('border-radius', '4px').style('padding', isMobile ? '3px 5px' : '6px 8px')
        .style('height', isMobile ? '22px' : '32px');
    }
    return group;
  }

  modeSelect = createSelect();
  modeSelect.option('Geburtstag'); modeSelect.option('Affirmation');
  createUIGroup("MODUS", modeSelect, "80px", "110px");

  inputField = createInput("15011987");
  createUIGroup("EINGABE", inputField, "75px", "140px");

  var codeGroup = createUIGroup("CODE", null, "auto", "auto");
  codeDisplay = createSpan("").parent(codeGroup).style('font-size', isMobile ? '11px' : '14px').style('color', '#fff').style('font-weight', '600').style('letter-spacing', '1px');

  sektS = createSelect();
  ["6","8","10","12","13"].forEach(s => sektS.option(s, s)); sektS.selected("8");
  createUIGroup("SEKTOR", sektS, "40px", "60px");

  richtungS = createSelect(); 
  richtungS.option("Außen", "a"); richtungS.option("Innen", "b");
  richtungS.selected("a");
  createUIGroup("RICHTUNG", richtungS, "65px", "100px");

  var saveBtn = createButton('DOWNLOAD').parent(topBar)
    .style('margin-left', 'auto').style('background', '#ffffff').style('color', '#2c3e50')
    .style('border', 'none').style('font-weight', 'bold').style('border-radius', '4px')
    .style('padding', isMobile ? '6px 8px' : '10px 16px').style('font-size', isMobile ? '9px' : '12px').style('cursor', 'pointer');
  saveBtn.mousePressed(exportHighRes);

  sliderPanel = createDiv("").style('position', 'fixed').style('background', 'rgba(44, 62, 80, 0.98)').style('z-index', '150');
  for (var i = 1; i <= 9; i++) {
    var sRow = createDiv("").parent(sliderPanel).style('display','flex').style('align-items','center').style('gap','4px');
    colorIndicators[i] = createDiv("").parent(sRow).style('width', '8px').style('height', '8px').style('border-radius', '50%');
    sliders[i] = createSlider(20, 100, 85).parent(sRow).input(() => redraw());
  }

  updateLayout();
  [modeSelect, inputField, sektS, richtungS].forEach(e => e.input ? e.input(redraw) : e.changed(redraw));
}

// ==========================================
// 3. LAYOUT & DRAW
// ==========================================
function updateLayout() {
  var isMobile = windowWidth < 600;
  if (isMobile) {
    sliderPanel.style('top', 'auto').style('bottom', '0').style('left', '0').style('width', '100%')
      .style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)').style('padding', '8px 4px').style('gap', '4px');
    for (var i = 1; i <= 9; i++) if(sliders[i]) sliders[i].style('width', '75px'); // [cite: 2026-02-11]
  } else {
    sliderPanel.style('bottom', 'auto').style('top', '90px').style('left', '0').style('width', 'auto')
      .style('display', 'flex').style('flex-direction', 'column').style('padding', '12px').style('border-radius', '0 8px 8px 0');
    for (var i = 1; i <= 9; i++) if(sliders[i]) sliders[i].style('width', '80px');
  }
}

function draw() {
  var isMobile = windowWidth < 600;
  var rawVal = inputField.value().trim();
  if (rawVal === "" || (modeSelect.value() === 'Geburtstag' && rawVal.replace(/\D/g, "").length === 0)) return;

  background(255);
  var sector = buildSector(); // Funktion aus mandala_rund.js
  var currentColors = getColorMatrix(colorSeed);
  
  for (var i = 1; i <= 9; i++) { 
    if(colorIndicators[i]) colorIndicators[i].style('background-color', currentColors[i-1]); 
  }

  push();
  var centerY = isMobile ? height / 2 - 40 : height / 2 + 20;
  var centerX = width / 2; 
  translate(centerX, centerY);
  
  var scaleFactor = (min(width, height) / 900) * (isMobile ? 0.85 : 0.95);
  scale(scaleFactor);
  
  var sc = int(sektS.value());
  var angle = TWO_PI / sc;
  for (var i = 0; i < sc; i++) {
    push(); rotate(i * angle); drawSector(sector, currentColors); pop();
  }
  pop();

  if (logoImg && logoImg.width > 0) {
    push(); resetMatrix();
    var lW = isMobile ? 55 : 150;
    var lH = (logoImg.height / logoImg.width) * lW;
    var logoY = isMobile ? height - 125 : height - lH - 25;
    image(logoImg, 15, logoY, lW, lH); 
    pop();
  }
}

// ==========================================
// 4. HILFSFUNKTIONEN
// ==========================================
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateLayout();
  redraw();
}

// Export Funktion bleibt erhalten wie im Original...
function exportHighRes() {
  // ... (Code wie in deiner Vorlage)
}


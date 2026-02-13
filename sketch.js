// GLOBALE VARIABLEN - NUR HIER DEKLARIEREN
var inputField, modeSelect, sektS, richtungS, dirSelect, sliders = [], colorIndicators = [], sliderPanel, codeDisplay;
var logoImg, qMatrix = [], colorSeed = 1, isAdmin = false;

// Gemeinsame Farben und Maps
const baseColors = ["#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3"];
const charMap = { 'A':1,'J':1,'S':1,'Ä':1,'B':2,'K':2,'T':2,'Ö':2,'C':3,'L':3,'U':3,'Ü':3,'D':4,'M':4,'V':4,'ß':4,'E':5,'N':5,'W':5,'F':6,'O':6,'X':6,'G':7,'P':7,'Y':7,'H':8,'Q':8,'Z':8,'I':9,'R':9 };
const ex = (a, b) => (a + b) % 9 === 0 ? 9 : (a + b) % 9;

function preload() { logoImg = loadImage('logo.png'); }

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  
  let isMobile = windowWidth < 600;

  // TOPBAR FIX: Höhe und Z-Index angepasst, damit sie nichts überlappt
  let topBar = createDiv("").style('position', 'fixed').style('top', '0').style('left', '0').style('width', '100%')
    .style('background', '#2c3e50').style('display', 'flex').style('align-items', 'center').style('padding', '0 15px')
    .style('z-index', '1000').style('height', isMobile ? '60px' : '80px').style('box-sizing', 'border-box');

  // UI Elemente erstellen...
  modeSelect = createSelect().parent(topBar); 
  modeSelect.option('Wabe'); modeSelect.option('Rund'); modeSelect.option('Quadrat');
  
  inputField = createInput("15011987").parent(topBar);
  
  // Slider Panel
  sliderPanel = createDiv("").style('position', 'fixed').style('z-index', '1000');
  for (let i = 1; i <= 9; i++) {
    let sRow = createDiv("").parent(sliderPanel).style('display','flex').style('align-items','center');
    colorIndicators[i] = createDiv("").parent(sRow).style('width','10px').style('height','10px');
    sliders[i] = createSlider(20, 100, 85).parent(sRow).input(() => redraw());
    sliders[i].style('width', '75px'); // [cite: 2026-02-11]
  }

  updateLayout();
  [modeSelect, inputField].forEach(e => e.changed(redraw));
}

function updateLayout() {
  let isMobile = windowWidth < 600;
  if (isMobile) {
    sliderPanel.style('bottom', '0').style('left', '0').style('width', '100%').style('display', 'grid').style('grid-template-columns', '1fr 1fr 1fr');
  } else {
    sliderPanel.style('top', '100px').style('left', '10px').style('display', 'block');
  }
}

function draw() {
  background(255);
  let mode = modeSelect.value();
  let code = inputField.value().replace(/\D/g, "").split("").map(Number);
  while(code.length < 8) code.push(0);
  
  push();
  translate(width/2, height/2 + (windowWidth < 600 ? -30 : 20));
  
  // Aufruf der modularen Funktionen
  if (mode === 'Wabe') drawWabe(code, code[0]||1);
  else if (mode === 'Rund') drawRund(code);
  else if (mode === 'Quadrat') drawQuadrat(code);
  pop();
}

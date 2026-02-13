// ==========================================
// SKETCH.JS - HAUPTSTEUERUNG
// ==========================================

// 1. Globale Variablen & Bilder
var logoImg;
var isAdmin = false;

// 2. Variablen für Mandala_Quadrat
var qMatrixQuadrat, colorMatrixQuadrat = {}, mapZQuadrat = {};
var slidersQuadrat = {}, inputFieldQuadrat, charMapQuadrat = {};
var sliderPanelQuadrat;

// 3. Variablen für Mandala_Rund
var slidersRund = {}, modeSelectRund, inputFieldRund, richtungSRund, sektSRund;
var codeDisplayRund, affirmMapRund = {}, colorSeedRund = 1;
var sliderPanelRund;

// 4. Variablen für Mandala_Wabe
var slidersWabe = {}, dirSWabe, colorMatrixWabe = {};
var sliderPanelWabe;

// 5. Allgemeine Steuerung
var modeSelectGlobal;

function preload() {
  // Verhindert Absturz, falls logo.png fehlt
  try {
    logoImg = loadImage('logo.png');
  } catch (e) {
    console.log("Logo konnte nicht geladen werden.");
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  
  // Modus-Auswahl (Dropdown oben links)
  modeSelectGlobal = createSelect();
  modeSelectGlobal.position(10, 10);
  modeSelectGlobal.option('Quadrat');
  modeSelectGlobal.option('Rund');
  modeSelectGlobal.option('Wabe');
  modeSelectGlobal.changed(updateModeVisibility);

  // Initialisierung der Datenstrukturen (Beispielhaft)
  initDataStructures();
  
  // UI-Panels erstellen
  createUIQuadrat();
  createUIRund();
  createUIWabe();

  updateModeVisibility();
}

function draw() {
  background(255);
  
  // Zeichne Logo (falls vorhanden)
  if (logoImg) image(logoImg, width - 120, 10, 100, 40);

  // Verschiebe Zeichnung in die Mitte (unterhalb der Menüleiste)
  push();
  translate(width / 2, height / 2 + 50);

  var currentMode = modeSelectGlobal.value();
  if (currentMode === 'Quadrat') {
    var code = getCodeFromTextQuadrat();
    calcQuadratMatrixLogic(code);
    drawQuadratShape(code[0]);
  } else if (currentMode === 'Rund') {
    var m = buildSectorRund();
    var cols = getColorMatrixRund(colorSeedRund);
    var sc = int(sektSRund.value());
    for (var i = 0; i < sc; i++) {
      push();
      rotate(i * TWO_PI / sc);
      drawSectorRundLogic(m, cols);
      pop();
    }
  } else if (currentMode === 'Wabe') {
    var code = getCodeFromTextWabe(inputFieldQuadrat.value()); // Nutzt gleiches Feld oder eigenes
    renderWabeKorrektLogic(code, 0); 
  }
  pop();
}

function updateModeVisibility() {
  var m = modeSelectGlobal.value();
  
  // Zeige/Verstecke Panels
  sliderPanelQuadrat.style('display', m === 'Quadrat' ? 'flex' : 'none');
  sliderPanelRund.style('display', m === 'Rund' ? 'flex' : 'none');
  sliderPanelWabe.style('display', m === 'Wabe' ? 'flex' : 'none');
  
  // Layout-Anpassung (Mobile Breite 75px) [cite: 2026-02-11]
  if (m === 'Quadrat') updateLayoutQuadrat();
  if (m === 'Rund') updateLayoutRund();
  if (m === 'Wabe') updateLayoutWabe();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateModeVisibility();
}

// Hilfsfunktionen zur UI-Erstellung (Platzhalter - hier deine Button-Logik einfügen)
function createUIQuadrat() {
  sliderPanelQuadrat = createDiv('').id('panelQuadrat');
  inputFieldQuadrat = createInput('NAME');
  inputFieldQuadrat.parent(sliderPanelQuadrat);
  for(var i=1; i<=9; i++) slidersQuadrat[i] = createSlider(20, 100, 85).parent(sliderPanelQuadrat);
}

function createUIRund() {
  sliderPanelRund = createDiv('').id('panelRund');
  inputFieldRund = createInput('15011987');
  inputFieldRund.parent(sliderPanelRund);
  sektSRund = createSlider(4, 36, 8, 2).parent(sliderPanelRund);
  richtungSRund = createSelect().parent(sliderPanelRund);
  richtungSRund.option('Außen', 'a');
  richtungSRund.option('Innen', 'b');
  modeSelectRund = createSelect().parent(sliderPanelRund);
  modeSelectRund.option('Geburtstag');
  modeSelectRund.option('Affirmation');
  for(var i=1; i<=9; i++) slidersRund[i] = createSlider(20, 100, 85).parent(sliderPanelRund);
}

function createUIWabe() {
  sliderPanelWabe = createDiv('').id('panelWabe');
  dirSWabe = createSelect().parent(sliderPanelWabe);
  dirSWabe.option('nach innen');
  dirSWabe.option('nach außen');
  for(var i=1; i<=9; i++) slidersWabe[i] = createSlider(20, 100, 85).parent(sliderPanelWabe);
}

function initDataStructures() {
  // Hier werden die Maps (Farben, Buchstaben) initialisiert, 
  // falls sie nicht in den anderen Dateien stehen.
  charMapQuadrat = {'A':1,'B':2,'C':3,'D':4,'E':5,'F':6,'G':7,'H':8,'I':9,'J':1,'K':2,'L':3,'M':4,'N':5,'O':6,'P':7,'Q':8,'R':9,'S':1,'T':2,'U':3,'V':4,'W':5,'X':6,'Y':7,'Z':8,'Ä':1,'Ö':2,'Ü':3,'ß':4};
  mapZQuadrat = {1:"#FF0000", 2:"#00008B", 3:"#00FF00", 4:"#FFFF00", 5:"#87CEEB", 6:"#40E0D0", 7:"#FFC0CB", 8:"#FFA500", 9:"#9400D3"};
  colorMatrixWabe[0] = ["#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3"];
}

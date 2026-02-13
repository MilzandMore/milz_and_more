// MASTER SKETCH - Milz & More
let mainSelect;
let currentDrawFunction = null;
let logoImg;
let isAdmin = false;

function preload() {
  logoImg = loadImage('logo.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  
  // Der Haupt-Umschalter
  mainSelect = createSelect();
  mainSelect.position(10, 10);
  mainSelect.option('Wabe');
  mainSelect.option('Rund');
  mainSelect.option('Quadrat');
  mainSelect.selected('Wabe');
  mainSelect.changed(changeApp);
  
  // Styling des Hauptumschalters
  mainSelect.style('z-index', '2000');
  mainSelect.style('padding', '5px');
  mainSelect.style('border-radius', '5px');
  mainSelect.style('background', '#ffffff');
  mainSelect.style('border', '2px solid #2c3e50');
  mainSelect.style('font-weight', 'bold');

  // Initialer Start
  changeApp();
}

function draw() {
  background(255);
  if (currentDrawFunction) {
    currentDrawFunction();
  }
}

function changeApp() {
  // 1. RADIKALER RESET: Alle bestehenden UI-Elemente der Apps entfernen
  removeAppUI();

  let mode = mainSelect.value();

  // 2. Die gewählte App neu initialisieren
  if (mode === 'Wabe') {
    if (typeof setupWabe === "function") {
      setupWabe(); 
      currentDrawFunction = drawWabe;
    }
  } 
  else if (mode === 'Rund') {
    if (typeof setupRund === "function") {
      setupRund();
      currentDrawFunction = drawRund;
    }
  } 
  else if (mode === 'Quadrat') {
    if (typeof setupQuadrat === "function") {
      setupQuadrat();
      currentDrawFunction = drawQuadrat;
    }
  }
}

function removeAppUI() {
  // Sucht alle Divs, die von den Unterprogrammen erstellt wurden (TopBars und Panels)
  // und entfernt sie komplett aus dem DOM, um Überlagerungen zu verhindern.
  
  // Wir löschen die spezifischen Variablen, falls sie existieren
  if (topBarWabe) { topBarWabe.remove(); topBarWabe = null; }
  if (sliderPanelWabe) { sliderPanelWabe.remove(); sliderPanelWabe = null; }
  
  if (topBarRund) { topBarRund.remove(); topBarRund = null; }
  if (sliderPanelRund) { sliderPanelRund.remove(); sliderPanelRund = null; }
  
  if (topBarQuadrat) { topBarQuadrat.remove(); topBarQuadrat = null; }
  if (sliderPanelQuadrat) { sliderPanelQuadrat.remove(); sliderPanelQuadrat = null; }

  // Setzt auch die Slider-Arrays zurück
  slidersWabe = [];
  slidersRund = [];
  slidersQuadrat = [];
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Bei Resize Layouts refreshen
  if (typeof updateLayoutWabe === "function" && topBarWabe) updateLayoutWabe();
  if (typeof updateLayoutRund === "function" && topBarRund) updateLayoutRund();
  if (typeof updateLayoutQuadrat === "function" && topBarQuadrat) updateLayoutQuadrat();
}

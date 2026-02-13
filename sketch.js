// MASTER SKETCH - Milz & More
let mainSelect;
let currentDrawFunction = null;
let logoImg;
let isAdmin = false;

// Globale UI-Referenzen
let topBarWabe, sliderPanelWabe, topBarRund, sliderPanelRund, topBarQuadrat, sliderPanelQuadrat;
let slidersWabe = [], slidersRund = [], slidersQuadrat = [];

function preload() {
  logoImg = loadImage('logo.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  
  // Haupt-Umschalter jetzt ZENTRIERT oben, um nichts zu verdecken
  mainSelect = createSelect();
  let selectW = 100;
  mainSelect.position(windowWidth/2 - selectW/2, 10);
  mainSelect.option('Wabe');
  mainSelect.option('Rund');
  mainSelect.option('Quadrat');
  mainSelect.selected('Wabe');
  mainSelect.changed(changeApp);
  
  mainSelect.style('z-index', '3000');
  mainSelect.style('padding', '6px');
  mainSelect.style('border-radius', '4px');
  mainSelect.style('background', '#ffffff');
  mainSelect.style('border', '2px solid #2c3e50');
  mainSelect.style('font-weight', 'bold');

  changeApp();
}

function draw() {
  background(255);
  if (currentDrawFunction) {
    currentDrawFunction();
  }
}

function changeApp() {
  removeAppUI();
  // Neupositionierung bei App-Wechsel (falls Fenstergröße geändert)
  mainSelect.position(windowWidth/2 - 50, 10);
  
  let mode = mainSelect.value();
  if (mode === 'Wabe' && typeof setupWabe === "function") {
    setupWabe(); currentDrawFunction = drawWabe;
  } else if (mode === 'Rund' && typeof setupRund === "function") {
    setupRund(); currentDrawFunction = drawRund;
  } else if (mode === 'Quadrat' && typeof setupQuadrat === "function") {
    setupQuadrat(); currentDrawFunction = drawQuadrat;
  }
}

function removeAppUI() {
  let elements = selectAll('.app-ui');
  for (let el of elements) { el.remove(); }
  topBarWabe = null; sliderPanelWabe = null;
  topBarRund = null; sliderPanelRund = null;
  topBarQuadrat = null; sliderPanelQuadrat = null;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  mainSelect.position(windowWidth/2 - 50, 10);
  changeApp();
}

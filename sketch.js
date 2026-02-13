// MASTER SKETCH - Milz & More
let mainSelect;
let currentDrawFunction = null;
let logoImg;
let isAdmin = false;

// Globale UI-Referenzen zum sauberen Löschen
let topBarWabe, sliderPanelWabe, topBarRund, sliderPanelRund, topBarQuadrat, sliderPanelQuadrat;
let slidersWabe = [], slidersRund = [], slidersQuadrat = [];

function preload() {
  logoImg = loadImage('logo.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  
  mainSelect = createSelect();
  mainSelect.position(10, 10);
  mainSelect.option('Wabe');
  mainSelect.option('Rund');
  mainSelect.option('Quadrat');
  mainSelect.selected('Wabe');
  mainSelect.changed(changeApp);
  
  // Styling für den Haupt-Umschalter
  mainSelect.style('z-index', '3000');
  mainSelect.style('padding', '8px');
  mainSelect.style('border-radius', '5px');
  mainSelect.style('background', '#ffffff');
  mainSelect.style('border', '2px solid #2c3e50');
  mainSelect.style('font-size', '14px');
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
  let mode = mainSelect.value();

  if (mode === 'Wabe' && typeof setupWabe === "function") {
    setupWabe();
    currentDrawFunction = drawWabe;
  } else if (mode === 'Rund' && typeof setupRund === "function") {
    setupRund();
    currentDrawFunction = drawRund;
  } else if (mode === 'Quadrat' && typeof setupQuadrat === "function") {
    setupQuadrat();
    currentDrawFunction = drawQuadrat;
  }
}

function removeAppUI() {
  // Entfernt alle erzeugten DOM-Elemente restlos
  let elements = selectAll('.app-ui');
  for (let el of elements) {
    el.remove();
  }
  
  // Reset der Variablen
  topBarWabe = null; sliderPanelWabe = null;
  topBarRund = null; sliderPanelRund = null;
  topBarQuadrat = null; sliderPanelQuadrat = null;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Erzwingt UI-Update beim Drehen des Handys
  changeApp();
}

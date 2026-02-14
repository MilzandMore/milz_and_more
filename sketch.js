// MASTER SKETCH - Milz & More
let mainSelect;
let currentDrawFunction = null;
let logoImg;
let isAdmin = false;

function preload() {
  // Lädt das Logo für alle Unterprogramme
  logoImg = loadImage('logo.png');
}

function setup() {
  // Erstellt die Grundfläche
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  angleMode(RADIANS);

  // Der Haupt-Umschalter oben links
  mainSelect = createSelect();
  mainSelect.position(20, 20); // Etwas mehr Abstand zum Rand
  mainSelect.option('Wabe');
  mainSelect.option('Rund');
  mainSelect.option('Quadrat');
  mainSelect.selected('Wabe'); 
  mainSelect.changed(changeApp);

  // Styling via JS (zusätzlich zum CSS für garantierte Layering)
  mainSelect.style('z-index', '1000');
  
  // Initialer Start der ersten App
  changeApp();
}

function draw() {
  background(255);
  
  // Falls ein Logo vorhanden ist, zeichnen wir es dezent unten rechts
  if (logoImg) {
    push();
    imageMode(CORNER);
    let logoW = 100;
    let ratio = logoImg.height / logoImg.width;
    image(logoImg, windowWidth - logoW - 20, windowHeight - (logoW * ratio) - 20, logoW, logoW * ratio);
    pop();
  }

  if (currentDrawFunction) {
    currentDrawFunction();
  }
}

function changeApp() {
  hideAllUI();
  let mode = mainSelect.value();

  if (mode === 'Wabe') {
    if (typeof setupWabe === "function") {
      if (typeof topBarWabe === "undefined" || !topBarWabe) setupWabe();
      showUIWabe();
      currentDrawFunction = drawWabe;
    }
  } 
  else if (mode === 'Rund') {
    if (typeof setupRund === "function") {
      if (typeof topBarRund === "undefined" || !topBarRund) setupRund();
      showUIRund();
      currentDrawFunction = drawRund;
    }
  } 
  else if (mode === 'Quadrat') {
    if (typeof setupQuadrat === "function") {
      if (typeof topBarQuadrat === "undefined" || !topBarQuadrat) setupQuadrat();
      showUIQuadrat();
      currentDrawFunction = drawQuadrat;
    }
  }
}

function hideAllUI() {
  if (window.topBarWabe) topBarWabe.hide();
  if (window.sliderPanelWabe) sliderPanelWabe.hide();
  if (window.topBarRund) topBarRund.hide();
  if (window.sliderPanelRund) sliderPanelRund.hide();
  if (window.topBarQuadrat) topBarQuadrat.hide();
  if (window.sliderPanelQuadrat) sliderPanelQuadrat.hide();
}

function showUIWabe() {
  if (window.topBarWabe) topBarWabe.show();
  if (window.sliderPanelWabe) sliderPanelWabe.show();
}

function showUIRund() {
  if (window.topBarRund) topBarRund.show();
  if (window.sliderPanelRund) sliderPanelRund.show();
}

function showUIQuadrat() {
  if (window.topBarQuadrat) topBarQuadrat.show();
  if (window.sliderPanelQuadrat) sliderPanelQuadrat.show();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (typeof updateLayoutWabe === "function") updateLayoutWabe();
  if (typeof updateLayoutRund === "function") updateLayoutRund();
  if (typeof updateLayoutQuadrat === "function") updateLayoutQuadrat();
}

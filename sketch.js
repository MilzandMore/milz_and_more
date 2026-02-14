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
  mainSelect.position(10, 10);
  mainSelect.option('Wabe');
  mainSelect.option('Rund');
  mainSelect.option('Quadrat');
  mainSelect.selected('Wabe'); // Startet mit Wabe
  mainSelect.changed(changeApp);

  mainSelect.style('z-index', '1000');
  mainSelect.style('padding', '5px');
  mainSelect.style('border-radius', '5px');
  mainSelect.style('background', '#ecf0f1');
  mainSelect.style('font-weight', 'bold');

  // Initialer Start der ersten App
  changeApp();
}

function draw() {
  background(255);
  if (currentDrawFunction) {
    currentDrawFunction();
  }
}

function changeApp() {
  // 1. ALLE UI-Elemente aller Apps verstecken (Sicherheits-Reset)
  hideAllUI();

  let mode = mainSelect.value();

  // 2. Die gewählte App initialisieren (falls nötig) und anzeigen
  if (mode === 'Wabe') {
    if (typeof setupWabe === "function") {
      if (!topBarWabe) setupWabe();
      showUIWabe();
      currentDrawFunction = drawWabe;
    }
  } 
  else if (mode === 'Rund') {
    if (typeof setupRund === "function") {
      if (!topBarRund) setupRund();
      showUIRund();
      currentDrawFunction = drawRund;
    }
  } 
  else if (mode === 'Quadrat') {
    if (typeof setupQuadrat === "function") {
      if (!topBarQuadrat) setupQuadrat();
      showUIQuadrat();
      currentDrawFunction = drawQuadrat;
    }
  }
  
  redraw();
}

// HILFSFUNKTIONEN ZUM AUS- UND EINBLENDEN

function hideAllUI() {
  // Wabe
  if (topBarWabe) topBarWabe.hide();
  if (sliderPanelWabe) sliderPanelWabe.hide();
  // Rund
  if (topBarRund) topBarRund.hide();
  if (sliderPanelRund) sliderPanelRund.hide();
  // Quadrat
  if (topBarQuadrat) topBarQuadrat.hide();
  if (sliderPanelQuadrat) sliderPanelQuadrat.hide();
}

function showUIWabe() {
  if (topBarWabe) topBarWabe.show();
  if (sliderPanelWabe) sliderPanelWabe.show();
}

function showUIRund() {
  if (topBarRund) topBarRund.show();
  if (sliderPanelRund) sliderPanelRund.show();
}

function showUIQuadrat() {
  if (topBarQuadrat) topBarQuadrat.show();
  if (sliderPanelQuadrat) sliderPanelQuadrat.show();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Layouts anpassen, falls vorhanden
  if (typeof updateLayoutWabe === "function") updateLayoutWabe();
  if (typeof updateLayoutRund === "function") updateLayoutRund();
  if (typeof updateLayoutQuadrat === "function") updateLayoutQuadrat();
}




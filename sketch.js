// MASTER SKETCH - Milz & More
let mainSelect;
let currentDrawFunction = null;
let isAdmin = false;

function preload() {
  // Wir laden das Bild, definieren aber keine neue 'let logoImg', 
  // um den "already declared" Fehler zu vermeiden.
  // Das Bild wird automatisch der globalen Variable in den Untermodulen zugewiesen.
  logoImg = loadImage('logo.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  angleMode(RADIANS);

  // Das Dropdown-Menü zur Steuerung
  mainSelect = createSelect();
  mainSelect.position(10, 10);
  mainSelect.option('Wabe');
  mainSelect.option('Rund');
  mainSelect.option('Quadrat');
  mainSelect.selected('Wabe'); 
  mainSelect.changed(changeApp);
  
  // Wir setzen nur den Z-Index, damit es bedienbar bleibt.
  mainSelect.style('z-index', '10000');

  // Start der App
  changeApp();
}

function draw() {
  // Wir zeichnen hier NICHTS selbst. 
  // Keine Hintergrundfarbe, kein Logo. Nur deine Original-Logik.
  if (currentDrawFunction) {
    currentDrawFunction();
  }
}

function changeApp() {
  hideAllUI();
  let mode = mainSelect.value();

  if (mode === 'Wabe') {
    if (typeof setupWabe === "function") {
      if (!window.topBarWabe) setupWabe();
      showUIWabe();
      currentDrawFunction = drawWabe;
    }
  } 
  else if (mode === 'Rund') {
    if (typeof setupRund === "function") {
      if (!window.topBarRund) setupRund();
      showUIRund();
      currentDrawFunction = drawRund;
    }
  } 
  else if (mode === 'Quadrat') {
    if (typeof setupQuadrat === "function") {
      if (!window.topBarQuadrat) setupQuadrat();
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

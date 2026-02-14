// MASTER SKETCH - Milz & More
// HINWEIS: Wir deklarieren hier KEIN 'let logoImg' oder 'let isAdmin', 
// da diese in deinen Mandala-Skripten bereits vorhanden sind.

var mainSelect;
var currentDrawFunction = null;

function preload() {
  // Wir laden das Logo einfach global. Die Variable 'logoImg' 
  // wird von deinen Unterprogrammen automatisch erkannt.
  logoImg = loadImage('logo.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  angleMode(RADIANS);

  // Der Umschalter für die Formen
  mainSelect = createSelect();
  mainSelect.position(20, 20); // Positioniert ihn so, dass er nicht deine Top-Bar verdeckt
  mainSelect.option('Wabe');
  mainSelect.option('Rund');
  mainSelect.option('Quadrat');
  mainSelect.selected('Wabe'); 
  mainSelect.changed(changeApp);
  
  // Höchster Z-Index, damit er immer klickbar bleibt
  mainSelect.style('z-index', '99999');

  changeApp();
}

function draw() {
  // Wir zeichnen hier NICHTS selbst. Deine Original-Logik macht alles.
  if (currentDrawFunction) {
    currentDrawFunction();
  }
}

function changeApp() {
  // 1. Alle UI-Elemente verstecken
  hideAllUI();

  let mode = mainSelect.value();

  // 2. Weiche zu deinen Original-Funktionen
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

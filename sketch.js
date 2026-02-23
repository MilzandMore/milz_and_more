// MASTER HÜLLE - Milz & More
// Wir deklarieren hier KEINE Variablen mit let/const, um Abstürze zu vermeiden!

function preload() {
  // Lädt das Logo so, dass deine Original-Codes darauf zugreifen können
  window.logoImg = loadImage('logo.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  angleMode(RADIANS);

  // Der Schalter (Dropdown)
  window.mainSelect = createSelect();
  
  // POSITION: Unten links, damit er deine Top-Bar oben niemals verdeckt
  window.mainSelect.position(20, windowHeight - 60);
  
  window.mainSelect.option('Wabe');
  window.mainSelect.option('Rund');
  window.mainSelect.option('Quadrat');
  window.mainSelect.selected('Wabe'); 
  window.mainSelect.changed(changeApp);
  
  // Hoher Z-Index für die Bedienbarkeit über dem Canvas
  window.mainSelect.style('z-index', '999999');

  changeApp();
}

function draw() {
  // Führt NUR die Logik deiner originalen Codes aus
  if (window.currentDrawFunction) {
    window.currentDrawFunction();
  }
}

function changeApp() {
  // Alle UI-Elemente deiner Codes verstecken (für den Wechsel)
  if (window.topBarWabe) window.topBarWabe.hide();
  if (window.sliderPanelWabe) window.sliderPanelWabe.hide();
  if (window.topBarRund) window.topBarRund.hide();
  if (window.sliderPanelRund) window.sliderPanelRund.hide();
  if (window.topBarQuadrat) window.topBarQuadrat.hide();
  if (window.sliderPanelQuadrat) window.sliderPanelQuadrat.hide();

  var mode = window.mainSelect.value();

  // Weiche zu deinen 3 Original-Logiken
  if (mode === 'Wabe') {
    if (typeof setupWabe === "function") {
      if (!window.topBarWabe) setupWabe();
      if (window.topBarWabe) window.topBarWabe.show();
      if (window.sliderPanelWabe) window.sliderPanelWabe.show();
      window.currentDrawFunction = drawWabe;
    }
  } 
  else if (mode === 'Rund') {
    if (typeof setupRund === "function") {
      if (!window.topBarRund) setupRund();
      if (window.topBarRund) window.topBarRund.show();
      if (window.sliderPanelRund) window.sliderPanelRund.show();
      window.currentDrawFunction = drawRund;
    }
  } 
  else if (mode === 'Quadrat') {
    if (typeof setupQuadrat === "function") {
      if (!window.topBarQuadrat) setupQuadrat();
      if (window.topBarQuadrat) window.topBarQuadrat.show();
      if (window.sliderPanelQuadrat) window.sliderPanelQuadrat.show();
      window.currentDrawFunction = drawQuadrat;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Hält den Umschalter unten links fixiert
  if (window.mainSelect) window.mainSelect.position(20, windowHeight - 60);
}

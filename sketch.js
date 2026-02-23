// MASTER HÜLLE - Milz & More
// KEINE let oder const Variablen hier, um Konflikte mit deinen Codes zu vermeiden!

function preload() {
  // Lädt das Logo global. Deine Mandala-Codes finden es automatisch.
  window.logoImg = loadImage('logo.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  angleMode(RADIANS);

  // Der Umschalter wird an das globale window-Objekt gebunden.
  window.mainSelect = createSelect();
  
  // POSITION: Unten links, damit deine originale Top-Bar oben frei bleibt.
  window.mainSelect.position(20, windowHeight - 60);
  
  window.mainSelect.option('Wabe');
  window.mainSelect.option('Rund');
  window.mainSelect.option('Quadrat');
  window.mainSelect.selected('Wabe'); 
  window.mainSelect.changed(changeApp);
  
  // Z-Index hoch, damit er über dem Canvas bleibt.
  window.mainSelect.style('z-index', '999999');

  changeApp();
}

function draw() {
  // Führt NUR die Zeichen-Funktion deiner originalen Mandala-Dateien aus.
  if (window.currentDrawFunction) {
    window.currentDrawFunction();
  }
}

function changeApp() {
  // UI-Elemente deiner Codes verstecken
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
  // Hält den Umschalter unten links fixiert.
  if (window.mainSelect) window.mainSelect.position(20, windowHeight - 60);
}


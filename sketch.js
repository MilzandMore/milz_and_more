// MASTER SKETCH - Milz & More
// KEINE Variablen-Deklaration mit 'let', um Konflikte zu vermeiden.

function preload() {
  // Lädt das Logo global, ohne eine neue Variable zu erstellen.
  // So greifen deine Original-Skripte direkt auf das Bild zu.
  if (typeof logoImg === 'undefined') {
    window.logoImg = loadImage('logo.png');
  } else {
    logoImg = loadImage('logo.png');
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  angleMode(RADIANS);

  // Der Umschalter - wir setzen ihn ganz dezent oben links hin.
  window.mainSelect = createSelect();
  window.mainSelect.position(10, 10);
  window.mainSelect.option('Wabe');
  window.mainSelect.option('Rund');
  window.mainSelect.option('Quadrat');
  window.mainSelect.selected('Wabe'); 
  window.mainSelect.changed(changeApp);
  
  // Z-Index extrem hoch, damit er über allem liegt, aber kein Styling!
  window.mainSelect.style('z-index', '999999');

  changeApp();
}

function draw() {
  // Ruft NUR deine Original-Funktionen auf.
  if (window.currentDrawFunction) {
    window.currentDrawFunction();
  }
}

function changeApp() {
  hideAllUI();
  let mode = window.mainSelect.value();

  if (mode === 'Wabe') {
    if (typeof setupWabe === "function") {
      if (!window.topBarWabe) setupWabe();
      showUIWabe();
      window.currentDrawFunction = drawWabe;
    }
  } 
  else if (mode === 'Rund') {
    if (typeof setupRund === "function") {
      if (!window.topBarRund) setupRund();
      showUIRund();
      window.currentDrawFunction = drawRund;
    }
  } 
  else if (mode === 'Quadrat') {
    if (typeof setupQuadrat === "function") {
      if (!window.topBarQuadrat) setupQuadrat();
      showUIQuadrat();
      window.currentDrawFunction = drawQuadrat;
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
  if (window.topBarWabe) window.topBarWabe.show();
  if (window.sliderPanelWabe) window.sliderPanelWabe.show();
}

function showUIRund() {
  if (window.topBarRund) window.topBarRund.show();
  if (window.sliderPanelRund) window.sliderPanelRund.show();
}

function showUIQuadrat() {
  if (window.topBarQuadrat) window.topBarQuadrat.show();
  if (window.sliderPanelQuadrat) window.sliderPanelQuadrat.show();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (typeof updateLayoutWabe === "function") updateLayoutWabe();
  if (typeof updateLayoutRund === "function") updateLayoutRund();
  if (typeof updateLayoutQuadrat === "function") updateLayoutQuadrat();
}

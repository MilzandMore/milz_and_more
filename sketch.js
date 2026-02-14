// MASTER SKETCH - Milz & More
let mainSelect;
let currentDrawFunction = null;
let isAdmin = false;

// Wir laden HIER kein Logo, da die Unterprogramme das bereits tun.

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Wir übernehmen die Modi, aber lassen die Unterprogramme den Rest machen
  colorMode(HSB, 360, 100, 100);
  angleMode(RADIANS);

  mainSelect = createSelect();
  mainSelect.position(10, 10);
  mainSelect.option('Wabe');
  mainSelect.option('Rund');
  mainSelect.option('Quadrat');
  mainSelect.selected('Wabe'); 
  mainSelect.changed(changeApp);
  mainSelect.style('z-index', '1000');

  changeApp();
}

function draw() {
  // KEIN Hintergrund, KEIN Logo. 
  // Nur der Aufruf der aktiven Mandala-Logik.
  if (currentDrawFunction) {
    currentDrawFunction();
  }
}

function changeApp() {
  hideAllUI();
  let mode = mainSelect.value();

  // Initialisierung der Unterprogramme
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


// MASTER HÜLLE - Milz & More
// Keine Variablen-Deklaration hier, um Logik-Konflikte zu vermeiden!

function preload() {
  // Das Logo wird geladen, falls deine Codes die Variable 'logoImg' erwarten
  window.logoImg = loadImage('logo.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  angleMode(RADIANS);

  // Der Schalter zum Switchen zwischen den 3 Codes
  window.mainSelect = createSelect();
  window.mainSelect.position(10, 10);
  window.mainSelect.option('Wabe');
  window.mainSelect.option('Rund');
  window.mainSelect.option('Quadrat');
  window.mainSelect.selected('Wabe'); 
  window.mainSelect.changed(changeApp);
  
  // Z-Index hoch, damit man immer umschalten kann
  window.mainSelect.style('z-index', '1000000');

  changeApp();
}

function draw() {
  // Ruft nur die Logik deiner Codes auf - keine eigene Maske!
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
  // Versteckt alle UI-Elemente deiner 3 Codes
  if (window.topBarWabe) window.topBarWabe.hide();
  if (window.sliderPanelWabe) window.sliderPanelWabe.hide();
  if (window.topBarRund) window.topBarRund.hide();
  if (window.sliderPanelRund) window.sliderPanelRund.hide();
  if (window.topBarQuadrat) window.topBarQuadrat.hide();
  if (window.sliderPanelQuadrat) window.sliderPanelQuadrat.hide();
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


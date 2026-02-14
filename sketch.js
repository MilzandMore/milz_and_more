// MASTER HÜLLE - Milz & More
// KEINE Variablen-Deklaration mit let/const hier, um Abstürze zu vermeiden!

function preload() {
  // Wir laden das Logo nur, falls es noch nicht da ist.
  // Deine Unterprogramme nutzen ihre eigene globale Variable.
  window.logoImg = loadImage('logo.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  angleMode(RADIANS);

  // Der Schalter - Wir setzen ihn nach UNTEN links, 
  // damit er deine Top-Bar oben niemals verdeckt.
  window.mainSelect = createSelect();
  window.mainSelect.position(20, windowHeight - 40);
  window.mainSelect.option('Wabe');
  window.mainSelect.option('Rund');
  window.mainSelect.option('Quadrat');
  window.mainSelect.selected('Wabe'); 
  window.mainSelect.changed(changeApp);
  
  // Hoher Z-Index für die Bedienbarkeit
  window.mainSelect.style('z-index', '1000000');

  changeApp();
}

function draw() {
  // Führt NUR die Logik deiner originalen Codes aus.
  if (window.currentDrawFunction) {
    window.currentDrawFunction();
  }
}

function changeApp() {
  hideAllUI();
  var mode = window.mainSelect.value();

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
  // Verschiebt den Umschalter mit, wenn das Fenster skaliert wird
  if (window.mainSelect) window.mainSelect.position(20, windowHeight - 40);
  
  if (typeof updateLayoutWabe === "function") updateLayoutWabe();
  if (typeof updateLayoutRund === "function") updateLayoutRund();
  if (typeof updateLayoutQuadrat === "function") updateLayoutQuadrat();
}

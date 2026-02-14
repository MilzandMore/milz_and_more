// MASTER HÜLLE - Milz & More
// KEINE Variablen mehr mit 'let' deklarieren! Das verhindert die Abstürze.

function preload() {
  // Wir laden das Logo nur global. Deine Codes greifen dann darauf zu.
  window.logoImg = loadImage('logo.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  angleMode(RADIANS);

  // Der Schalter (Dropdown)
  // Wir hängen ihn direkt an 'window', damit er keine lokale Variable braucht.
  window.mainSelect = createSelect();
  
  // POSITION: Ganz unten links, damit er deine Top-Bar niemals berührt
  window.mainSelect.position(20, windowHeight - 50);
  
  window.mainSelect.option('Wabe');
  window.mainSelect.option('Rund');
  window.mainSelect.option('Quadrat');
  window.mainSelect.selected('Wabe'); 
  window.mainSelect.changed(changeApp);
  
  // Z-Index extrem hoch, damit er klickbar ist
  window.mainSelect.style('z-index', '1000000');

  changeApp();
}

function draw() {
  // Ruft die Logik deiner originalen Codes auf.
  if (window.currentDrawFunction) {
    window.currentDrawFunction();
  }
}

function changeApp() {
  // Versteckt alle UI-Elemente deiner Codes beim Wechseln
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
  // Hält den Umschalter unten links, auch wenn das Fenster verkleinert wird
  if (window.mainSelect) window.mainSelect.position(20, windowHeight - 50);
}


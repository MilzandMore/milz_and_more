var currentApp = 'Wabe'; // Start-Modus
var appSelect, logoImg, isAdmin = false;

function preload() {
  logoImg = loadImage('logo.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  
  var params = getURLParams();
  if (params.access === 'milz_secret') isAdmin = true;

  // Zentrales Auswahlmenü für die Mandala-Art
  appSelect = createSelect().style('position', 'fixed').style('top', '10px').style('left', '10px').style('z-index', '300');
  appSelect.option('Wabe');
  appSelect.option('Rund');
  appSelect.option('Quadrat');
  appSelect.changed(switchApp);

  // Initialisiere die UI der drei Unter-Apps
  setupWabe();
  setupRund();
  setupQuadrat();

  switchApp(); // Setze initialen Status
}

function switchApp() {
  currentApp = appSelect.value();
  
  // Alle UIs verstecken
  topBarWabe.hide(); sliderPanelWabe.hide();
  topBarRund.hide(); sliderPanelRund.hide();
  topBarQuadrat.hide(); sliderPanelQuadrat.hide();

  // Nur die aktive UI zeigen
  if (currentApp === 'Wabe') { topBarWabe.show(); sliderPanelWabe.show(); }
  if (currentApp === 'Rund') { topBarRund.show(); sliderPanelRund.show(); }
  if (currentApp === 'Quadrat') { topBarQuadrat.show(); sliderPanelQuadrat.show(); }
  
  redraw();
}

function draw() {
  background(255);
  // Rufe nur die Zeichenfunktion der gewählten App auf
  if (currentApp === 'Wabe') drawWabe();
  if (currentApp === 'Rund') drawRund();
  if (currentApp === 'Quadrat') drawQuadrat();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateLayoutWabe();
  updateLayoutRund();
  updateLayoutQuadrat();
}


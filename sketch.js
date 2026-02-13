// MASTER SKETCH - Milz & More
let mainSelect;
let currentDrawFunction = null;
let logoImg;

// Globale UI-Referenzen
let topBarApp, sliderPanelApp;

function preload() {
  logoImg = loadImage('logo.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  
  // EIGENE LEISTE FÜR FORM-WAHL (Ganz oben)
  let nav = createDiv("").style('position','fixed').style('top','0').style('left','0').style('width','100%')
    .style('height','40px').style('background','#1a252f').style('display','flex').style('align-items','center')
    .style('padding','0 10px').style('z-index','5000');
  
  createSpan("FORM: ").parent(nav).style('color','#fff').style('font-size','12px').style('margin-right','10px').style('font-weight','bold');
  
  mainSelect = createSelect().parent(nav);
  mainSelect.option('Wabe');
  mainSelect.option('Rund');
  mainSelect.option('Quadrat');
  mainSelect.selected('Wabe');
  mainSelect.changed(changeApp);
  
  mainSelect.style('background','#fff').style('border','none').style('border-radius','3px').style('padding','3px 10px');

  changeApp();
}

function draw() {
  background(255);
  if (currentDrawFunction) {
    currentDrawFunction();
  }
}

function changeApp() {
  removeAppUI();
  let mode = mainSelect.value();
  
  // Jedes Mandala bekommt jetzt eine einheitliche Positionierung
  if (mode === 'Wabe' && typeof setupWabe === "function") {
    setupWabe(); currentDrawFunction = drawWabe;
  } else if (mode === 'Rund' && typeof setupRund === "function") {
    setupRund(); currentDrawFunction = drawRund;
  } else if (mode === 'Quadrat' && typeof setupQuadrat === "function") {
    setupQuadrat(); currentDrawFunction = drawQuadrat;
  }
}

function removeAppUI() {
  let elements = selectAll('.app-ui');
  for (let el of elements) { el.remove(); }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  changeApp();
}

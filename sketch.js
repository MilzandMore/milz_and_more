// sketch.js - Die Zentralsteuerung
let logoImg;
let currentMandala;
let typeSelect;
let mandalas = {};

function preload() {
  logoImg = loadImage('logo.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);

  // Initialisiere die drei Module
  mandalas['Quadrat'] = new MandalaQuadrat();
  mandalas['Rund'] = new MandalaRund();
  mandalas['Wabe'] = new MandalaWabe();

  // Erstelle den Haupt-Umschalter ganz links in der TopBar
  // Wir erstellen einen Container für die Modul-UI-Elemente
  let topBarContainer = createDiv("").id('topBarCustomUI').style('display', 'flex').style('gap', '10px').style('align-items', 'center');

  // FORM-WAHL (Globaler Umschalter)
  let typeGroup = createDiv("").style('display', 'flex').style('flex-direction', 'column');
  createSpan("FORM").parent(typeGroup).style('font-size', '10px').style('color', '#bdc3c7').style('font-weight', 'bold');
  typeSelect = createSelect().parent(typeGroup);
  typeSelect.option('Quadrat');
  typeSelect.option('Rund');
  typeSelect.option('Wabe');
  typeSelect.style('background', '#e74c3c').style('color', '#fff').style('border', 'none').style('border-radius', '4px').style('padding', '5px');
  
  typeSelect.changed(switchMandala);

  // Initialisierung der Module (sie hängen ihre UI in die TopBar)
  for (let key in mandalas) {
    mandalas[key].init(topBarContainer);
    mandalas[key].hide(); // Erstmal alle verstecken
  }

  // Start-Zustand
  switchMandala();
}

function switchMandala() {
  if (currentMandala) currentMandala.hide();
  currentMandala = mandalas[typeSelect.value()];
  currentMandala.show();
  updateLayout();
  redraw();
}

function draw() {
  if (currentMandala) {
    currentMandala.render();
    
    // Globales Logo-Rendering (damit es immer über allen Mandalas liegt)
    renderGlobalLogo();
  }
}

function renderGlobalLogo() {
  if (logoImg && logoImg.width > 0) {
    push();
    resetMatrix();
    let isMobile = windowWidth < 600;
    let lW = isMobile ? 55 : 150;
    let lH = (logoImg.height / logoImg.width) * lW;
    let logoY = isMobile ? height - 125 : height - lH - 25;
    image(logoImg, 15, logoY, lW, lH);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  for (let key in mandalas) {
    mandalas[key].updateLayout();
  }
  redraw();
}

function updateLayout() {
  if (currentMandala) currentMandala.updateLayout();
}

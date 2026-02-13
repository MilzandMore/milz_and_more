// ==========================================
// SKETCH.JS - PROFESSIONELLE HAUPTSTEUERUNG
// ==========================================

let logoImg;
let currentMandala = null;
let mainTypeSelect;
let mandalas = {};
let topBar;
let uiContainer;

function preload() {
  // Logo laden mit Fallback
  try {
    logoImg = loadImage('logo.png');
  } catch (e) {
    console.log("Logo konnte nicht geladen werden.");
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);

  // 1. Die einheitliche TopBar erstellen
  let isMobile = windowWidth < 600;
  topBar = createDiv("").style('position', 'fixed').style('top', '0').style('left', '0').style('width', '100%')
    .style('background', '#2c3e50').style('color', '#fff').style('display', 'flex').style('padding', isMobile ? '4px 8px' : '10px 20px')
    .style('gap', isMobile ? '8px' : '20px').style('font-family', '"Inter", sans-serif').style('z-index', '200')
    .style('align-items', 'center').style('box-sizing', 'border-box').style('height', isMobile ? '55px' : '75px');

  // 2. Der Form-Umschalter (Ganz links)
  let typeGroup = createDiv("").parent(topBar).style('display', 'flex').style('flex-direction', 'column');
  createSpan("FORM").parent(typeGroup).style('font-size', isMobile ? '8px' : '10px').style('color', '#bdc3c7').style('font-weight', 'bold').style('margin-bottom', '2px');
  
  mainTypeSelect = createSelect().parent(typeGroup);
  mainTypeSelect.option('Quadrat');
  mainTypeSelect.option('Rund');
  mainTypeSelect.option('Wabe');
  
  // Design des Form-Umschalters
  mainTypeSelect.style('background', '#e74c3c').style('color', '#fff').style('border', 'none')
    .style('border-radius', '4px').style('padding', isMobile ? '3px 5px' : '6px 8px')
    .style('font-weight', 'bold').style('cursor', 'pointer').style('height', isMobile ? '22px' : '32px');

  // 3. Container für die spezifischen Einstellungen der Mandalas
  uiContainer = createDiv("").parent(topBar).style('display', 'flex').style('gap', isMobile ? '8px' : '20px').style('align-items', 'center');

  // 4. Mandalas initialisieren
  mandalas['Quadrat'] = new MandalaQuadrat();
  mandalas['Rund'] = new MandalaRund();
  mandalas['Wabe'] = new MandalaWabe();

  // Jedes Mandala baut seine UI in den uiContainer
  for (let key in mandalas) {
    mandalas[key].init(uiContainer);
    mandalas[key].hide(); 
  }

  mainTypeSelect.changed(switchMandala);
  
  // Initialer Start
  switchMandala();
}

function switchMandala() {
  // Altes Mandala verstecken
  if (currentMandala) currentMandala.hide();
  
  // Neues Mandala aktivieren
  let selected = mainTypeSelect.value();
  currentMandala = mandalas[selected];
  
  if (currentMandala) {
    currentMandala.show();
    currentMandala.updateLayout();
  }
  redraw();
}

function draw() {
  background(255);
  if (currentMandala) {
    currentMandala.render();
  }
  
  // Logo immer oben aufzeichnen
  renderLogo();
}

function renderLogo() {
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
  if (currentMandala) currentMandala.updateLayout();
  redraw();
}

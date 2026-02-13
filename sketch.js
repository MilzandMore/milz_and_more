// ==========================================
// SKETCH.JS - FINALE HAUPTSTEUERUNG
// ==========================================

let logoImg;
let currentMandala = null;
let mainTypeSelect;
let mandalas = {};
let topBar;
let uiContainer;

function preload() {
  // Logo laden
  logoImg = loadImage('logo.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);

  let isMobile = windowWidth < 600;

  // 1. Die einheitliche TopBar erstellen (Dunkler Balken oben)
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
  
  mainTypeSelect.style('background', '#e74c3c').style('color', '#fff').style('border', 'none')
    .style('border-radius', '4px').style('padding', isMobile ? '3px 5px' : '6px 8px')
    .style('font-weight', 'bold').style('cursor', 'pointer').style('height', isMobile ? '22px' : '32px');

  // 3. Container für die spezifischen Einstellungen (hier klinken sich die Klassen ein)
  uiContainer = createDiv("").parent(topBar).style('display', 'flex').style('gap', isMobile ? '8px' : '20px').style('align-items', 'center');

  // 4. Mandalas als Objekte initialisieren
  mandalas['Quadrat'] = new MandalaQuadrat();
  mandalas['Rund'] = new MandalaRund();
  mandalas['Wabe'] = new MandalaWabe();

  // Jedes Mandala baut seine eigene UI in den uiContainer
  for (let key in mandalas) {
    mandalas[key].init(uiContainer); 
    mandalas[key].hide(); // Am Anfang alle verstecken
  }

  mainTypeSelect.changed(switchMandala);
  
  // Start mit Quadrat
  switchMandala();
}

function switchMandala() {
  if (currentMandala) currentMandala.hide();
  
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
  
  // Logo einblenden
  if (logoImg) {
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

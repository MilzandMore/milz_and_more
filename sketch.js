// MASTER SKETCH - Milz & More
let currentMode = 'Wabe';
let currentDrawFunction = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  
  // Seitliche Navigation (Icons)
  let sideNav = createDiv("").style('position','fixed').style('left','10px').style('top','100px')
    .style('display','flex').style('flex-direction','column').style('gap','12px').style('z-index','6000');
  
  // Buttons mit Symbolen
  createShapeBtn(sideNav, '⬢', 'Wabe');
  createShapeBtn(sideNav, '●', 'Rund');
  createShapeBtn(sideNav, '■', 'Quadrat');

  // Start-App
  setTimeout(() => changeApp('Wabe'), 100); 
}

function createShapeBtn(parent, symbol, mode) {
  let btn = createButton(symbol).parent(parent);
  btn.style('width','50px').style('height','50px').style('background','#1a252f')
     .style('color','#fff').style('border','2px solid #34495e').style('border-radius','10px')
     .style('font-size','24px').style('cursor','pointer').style('box-shadow','2px 4px 10px rgba(0,0,0,0.3)');
  
  btn.mousePressed(() => changeApp(mode));
}

function draw() {
  background(255);
  if (currentDrawFunction) {
    currentDrawFunction();
  }
}

function changeApp(mode) {
  let elements = selectAll('.app-ui');
  for (let el of elements) { el.remove(); }
  
  currentMode = mode;
  
  // Sicherstellen, dass die Funktionen existieren (Fehlerschutz)
  if (mode === 'Wabe' && typeof setupWabe === 'function') {
    setupWabe(); currentDrawFunction = drawWabe;
  } else if (mode === 'Rund' && typeof setupRund === 'function') {
    setupRund(); currentDrawFunction = drawRund;
  } else if (mode === 'Quadrat' && typeof setupQuadrat === 'function') {
    setupQuadrat(); currentDrawFunction = drawQuadrat;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  changeApp(currentMode);
}

// MASTER SKETCH - Milz & More
let currentMode = 'Wabe';
let currentDrawFunction = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  
  // Seitliche Navigation erstellen
  let sideNav = createDiv("").style('position','fixed').style('left','10px').style('top','120px')
    .style('display','flex').style('flex-direction','column').style('gap','10px').style('z-index','6000');
  
  // Buttons für die Formen
  createShapeBtn(sideNav, '⬢', 'Wabe');
  createShapeBtn(sideNav, '●', 'Rund');
  createShapeBtn(sideNav, '■', 'Quadrat');

  changeApp('Wabe');
}

function createShapeBtn(parent, symbol, mode) {
  let btn = createButton(symbol).parent(parent);
  btn.style('width','45px').style('height','45px').style('background','#1a252f')
     .style('color','#fff').style('border','none').style('border-radius','8px')
     .style('font-size','20px').style('cursor','pointer').style('box-shadow','2px 2px 5px rgba(0,0,0,0.2)');
  
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
  if (mode === 'Wabe') { setupWabe(); currentDrawFunction = drawWabe; }
  else if (mode === 'Rund') { setupRund(); currentDrawFunction = drawRund; }
  else if (mode === 'Quadrat') { setupQuadrat(); currentDrawFunction = drawQuadrat; }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  changeApp(currentMode);
}

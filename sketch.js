let currentMode = 'Wabe';
let currentDrawFunction = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  
  // Seitliche Navigation: Icons links
  let sideNav = createDiv("").style('position','fixed').style('left','10px').style('top','100px')
    .style('display','flex').style('flex-direction','column').style('gap','12px').style('z-index','9000');
  
  // Die Icons werden hier mit exakt 55x55px definiert
  createShapeBtn(sideNav, '⬢', 'Wabe');
  createShapeBtn(sideNav, '●', 'Rund');
  createShapeBtn(sideNav, '■', 'Quadrat');

  setTimeout(() => changeApp('Wabe'), 200);
}

function createShapeBtn(parent, symbol, mode) {
  let btn = createButton(symbol).parent(parent);
  btn.style('width','55px').style('height','55px').style('background','#1a252f')
     .style('color','#fff').style('border','none').style('border-radius','10px')
     .style('font-size','28px').style('cursor','pointer').style('display','flex')
     .style('align-items','center').style('justify-content','center');
  
  btn.mousePressed(() => changeApp(mode));
}

function draw() {
  background(255);
  if (currentDrawFunction) currentDrawFunction();
}

function changeApp(mode) {
  let elements = selectAll('.app-ui');
  for (let el of elements) { el.remove(); }
  currentMode = mode;
  
  if (mode === 'Wabe' && typeof setupWabe === 'function') { setupWabe(); currentDrawFunction = drawWabe; }
  else if (mode === 'Rund' && typeof setupRund === 'function') { setupRund(); currentDrawFunction = drawRund; }
  else if (mode === 'Quadrat' && typeof setupQuadrat === 'function') { setupQuadrat(); currentDrawFunction = drawQuadrat; }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  changeApp(currentMode);
}

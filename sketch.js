// MASTER SKETCH - Milz & More
let mainSelect;
let currentDrawFunction = null;

// Universelle UI-Variablen (keine namensspezifischen mehr!)
let globalTopBar, globalSliderPanel;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  
  // Die schwarze Navigationsleiste ganz oben (Fixiert 40px)
  let nav = createDiv("").style('position','fixed').style('top','0').style('left','0').style('width','100%')
    .style('height','40px').style('background','#1a252f').style('display','flex').style('align-items','center')
    .style('padding','0 10px').style('z-index','5000').style('box-sizing','border-box');
  
  createSpan("FORM: ").parent(nav).style('color','#fff').style('font-size','12px').style('margin-right','10px').style('font-weight','bold');
  
  mainSelect = createSelect().parent(nav);
  mainSelect.option('Wabe');
  mainSelect.option('Rund');
  mainSelect.option('Quadrat');
  mainSelect.selected('Wabe');
  mainSelect.changed(changeApp);
  mainSelect.style('background','#fff').style('border','none').style('border-radius','3px').style('padding','2px 8px');

  changeApp();
}

function draw() {
  background(255);
  if (currentDrawFunction) {
    currentDrawFunction();
  }
}

function changeApp() {
  // Alles Vorherige löschen
  let elements = selectAll('.app-ui');
  for (let el of elements) { el.remove(); }
  
  let mode = mainSelect.value();
  if (mode === 'Wabe') { setupWabe(); currentDrawFunction = drawWabe; }
  else if (mode === 'Rund') { setupRund(); currentDrawFunction = drawRund; }
  else if (mode === 'Quadrat') { setupQuadrat(); currentDrawFunction = drawQuadrat; }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  changeApp();
}

let logoImg;
let currentMandala = null;
let mainTypeSelect;
let mandalas = {};
let topBar;
let uiContainer;
let isAdmin = false;

function preload() {
  logoImg = loadImage('logo.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  
  let params = getURLParams();
  if (params.access === 'milz_secret') isAdmin = true;

  let isMobile = windowWidth < 600;

  topBar = createDiv("").style('position', 'fixed').style('top', '0').style('left', '0').style('width', '100%')
    .style('background', '#2c3e50').style('color', '#fff').style('display', 'flex').style('padding', isMobile ? '4px 8px' : '10px 20px')
    .style('gap', isMobile ? '8px' : '20px').style('font-family', '"Inter", sans-serif').style('z-index', '200')
    .style('align-items', 'center').style('box-sizing', 'border-box').style('height', isMobile ? '55px' : '75px');

  let typeGroup = createDiv("").parent(topBar).style('display', 'flex').style('flex-direction', 'column');
  createSpan("FORM").parent(typeGroup).style('font-size', isMobile ? '8px' : '10px').style('color', '#bdc3c7').style('font-weight', 'bold').style('margin-bottom', '2px');
  
  mainTypeSelect = createSelect().parent(typeGroup);
  mainTypeSelect.option('Quadrat');
  mainTypeSelect.option('Rund');
  mainTypeSelect.option('Wabe');
  
  mainTypeSelect.style('background', '#e74c3c').style('color', '#fff').style('border', 'none')
    .style('border-radius', '4px').style('padding', isMobile ? '3px 5px' : '6px 8px')
    .style('font-weight', 'bold').style('cursor', 'pointer').style('height', isMobile ? '22px' : '32px');

  uiContainer = createDiv("").parent(topBar).style('display', 'flex').style('gap', isMobile ? '8px' : '20px').style('align-items', 'center');

  let saveBtn = createButton('DOWNLOAD').parent(topBar)
    .style('margin-left', 'auto').style('background', '#ffffff').style('color', '#2c3e50')
    .style('border', 'none').style('font-weight', 'bold').style('border-radius', '4px')
    .style('padding', isMobile ? '6px 8px' : '10px 16px').style('font-size', isMobile ? '9px' : '12px').style('cursor', 'pointer');
  saveBtn.mousePressed(() => {
    if (currentMandala && currentMandala.exportHighRes) {
      currentMandala.exportHighRes(logoImg, isAdmin);
    }
  });

  mandalas['Quadrat'] = new MandalaQuadrat();
  mandalas['Rund'] = new MandalaRund();
  mandalas['Wabe'] = new MandalaWabe();

  for (let key in mandalas) {
    mandalas[key].init(uiContainer); 
    mandalas[key].hide(); 
  }

  mainTypeSelect.changed(switchMandala);
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
  if (currentMandala) currentMandala.render();
  if (logoImg && logoImg.width > 0) {
    push(); resetMatrix();
    let isMobile = windowWidth < 600;
    let lW = isMobile ? 55 : 150;
    let lH = (logoImg.height/logoImg.width)*lW;
    image(logoImg, 15, isMobile?height-125:height-lH-25, lW, lH);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  for (let key in mandalas) mandalas[key].updateLayout();
  redraw();
}

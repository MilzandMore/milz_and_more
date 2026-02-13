var currentMandala;
var quadratApp, rundApp, wabeApp;
var logoImg;
var isAdmin = false;

function preload() {
  logoImg = loadImage('logo.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);

  var params = getURLParams();
  if (params.access === 'milz_secret') isAdmin = true;

  var isMobile = windowWidth < 600;

  var topBar = createDiv("").style('position', 'fixed').style('top', '0').style('left', '0').style('width', '100%')
    .style('background', '#2c3e50').style('color', '#fff').style('display', 'flex').style('padding', isMobile ? '4px 8px' : '10px 20px')
    .style('gap', isMobile ? '8px' : '20px').style('font-family', '"Inter", sans-serif').style('z-index', '200')
    .style('align-items', 'center').style('box-sizing', 'border-box').style('height', isMobile ? '55px' : '75px');

  var formGroup = createDiv("").parent(topBar).style('display', 'flex').style('flex-direction', 'column');
  createSpan("FORM").parent(formGroup).style('font-size', isMobile ? '8px' : '10px').style('color', '#bdc3c7').style('text-transform', 'uppercase').style('font-weight', 'bold');
  var typeSelect = createSelect().parent(formGroup);
  typeSelect.option('Quadrat'); typeSelect.option('Rund'); typeSelect.option('Wabe');
  typeSelect.style('background', '#34495e').style('color', '#fff').style('border', 'none').style('border-radius', '4px')
    .style('padding', '4px').style('font-weight', 'bold').style('height', isMobile ? '22px' : '32px');

  quadratApp = new MandalaQuadrat();
  rundApp = new MandalaRund();
  wabeApp = new MandalaWabe();

  quadratApp.init(topBar);
  rundApp.init(topBar);
  wabeApp.init(topBar);

  rundApp.hide();
  wabeApp.hide();
  currentMandala = quadratApp;

  typeSelect.changed(() => {
    let val = typeSelect.value();
    quadratApp.hide(); rundApp.hide(); wabeApp.hide();
    if (val === 'Quadrat') currentMandala = quadratApp;
    else if (val === 'Rund') currentMandala = rundApp;
    else currentMandala = wabeApp;
    currentMandala.show();
    redraw();
  });

  var saveBtn = createButton('DOWNLOAD').parent(topBar)
    .style('margin-left', 'auto').style('background', '#ffffff').style('color', '#2c3e50')
    .style('border', 'none').style('font-weight', 'bold').style('border-radius', '4px')
    .style('padding', isMobile ? '6px 8px' : '10px 16px').style('font-size', isMobile ? '9px' : '12px').style('cursor', 'pointer');
  
  saveBtn.mousePressed(() => {
    currentMandala.exportHighRes(logoImg, isAdmin);
  });

  noLoop();
}

function draw() {
  background(255);
  if (currentMandala) currentMandala.render();

  if (logoImg && logoImg.width > 0) {
    var isMobile = windowWidth < 600;
    push(); resetMatrix();
    var lW = isMobile ? 55 : 150;
    var lH = (logoImg.height / logoImg.width) * lW;
    var logoY = isMobile ? height - 125 : height - lH - 25;
    image(logoImg, 15, logoY, lW, lH);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  quadratApp.updateLayout(); rundApp.updateLayout(); wabeApp.updateLayout();
  redraw();
}

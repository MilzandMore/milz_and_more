var inputFieldWabe, dirSelectWabe, slidersWabe = [];
var wMatrixWabe = [];
const mapZWabe = { 1: "#FFD670", 2: "#DEAAFF", 3: "#FF686B", 4: "#7A5BEC", 5: "#74FB92", 6: "#E9FF70", 7: "#C0FDFF", 8: "#B2C9FF", 9: "#FFCBF2" };

function setupWabe() {
  var isMobile = windowWidth < 600;
  slidersWabe = [];

  let topBar = createDiv("").addClass('app-ui').style('position', 'fixed').style('top', '0').style('left', '0').style('width', '100%')
    .style('background', '#2c3e50').style('display', 'flex').style('align-items', 'center').style('padding', '5px 10px')
    .style('gap', '15px').style('z-index', '5000').style('height', '65px').style('box-sizing','border-box');

  let inputGroup = createDiv("").parent(topBar).style('display','flex').style('flex-direction','column').style('margin-left', '70px');
  createSpan("EINGABE").parent(inputGroup).style('color','#bdc3c7').style('font-size','10px').style('font-weight','bold');
  inputFieldWabe = createInput('15011987').parent(inputGroup).style('width', isMobile ? '90px' : '130px');

  let dirGroup = createDiv("").parent(topBar).style('display','flex').style('flex-direction','column');
  createSpan("RICHTUNG").parent(dirGroup).style('color','#bdc3c7').style('font-size','10px').style('font-weight','bold');
  dirSelectWabe = createSelect().parent(dirGroup);
  dirSelectWabe.option('Außen'); dirSelectWabe.option('Innen');

  let saveBtn = createButton('DOWNLOAD').parent(topBar).addClass('app-ui')
    .style('margin-left', 'auto').style('padding', '10px 18px').style('background','#fff').style('border','none').style('border-radius','5px').style('font-weight','bold');
  saveBtn.mousePressed(() => save('Mandala_Wabe.png'));

  let panel = createDiv("").addClass('app-ui').style('position', 'fixed').style('background', 'rgba(44, 62, 80, 0.95)').style('z-index', '5000');
  if (isMobile) {
    panel.style('bottom', '0').style('left', '0').style('width', '100%').style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)').style('padding', '10px');
  } else {
    panel.style('top', '80px').style('left', '0').style('padding', '15px').style('border-radius', '0 10px 10px 0');
  }

  for (let i = 1; i <= 9; i++) {
    let sRow = createDiv("").parent(panel).style('display','flex').style('align-items','center').style('gap','8px').style('margin','3px 0');
    createDiv("").parent(sRow).style('width','12px').style('height','12px').style('border-radius','50%').style('background', mapZWabe[i]);
    slidersWabe[i] = createSlider(20, 100, 85).parent(sRow).style('width', '75px');
    slidersWabe[i].input(() => redraw());
  }
  [inputFieldWabe, dirSelectWabe].forEach(e => e.input(redraw));
}

function drawWabe() {
  let isMobile = windowWidth < 600;
  push();
  translate(width/2, isMobile ? height/2 - 20 : height/2 + 40);
  scale(isMobile ? 0.8 : 1.15); 
  calcWabeMatrixLogic(inputFieldWabe.value().replace(/[^0-9]/g, "").split('').map(Number));
  drawWabeShape();
  pop();
}

function drawWabeShape() {
  let size = 12; let h = sqrt(3) * size;
  for (let r = 0; r < 20; r++) {
    for (let c = 0; c < 20; c++) {
      let v = wMatrixWabe[r][c]; if (v === 0) continue;
      let sVal = slidersWabe[v].value();
      let col = color(mapZWabe[v]);
      fill(hue(col), saturation(col) * (sVal/100), brightness(col));
      stroke(0, 30); strokeWeight(0.2);
      let x = c * size * 1.5; let y = r * h + (c % 2 === 0 ? 0 : h / 2);
      for(let a=0; a<6; a++) { push(); rotate(PI/3 * a); drawHex(x, y, size); pop(); }
    }
  }
}

function drawHex(x, y, s) { 
  beginShape(); for (let i = 0; i < 6; i++) { vertex(x + cos(PI/3*i)*s, y + sin(PI/3*i)*s); } endShape(CLOSE); 
}

function calcWabeMatrixLogic(code) {
  while(code.length < 8) code.push(0);
  wMatrixWabe = Array(20).fill().map(() => Array(20).fill(0));
  for(let i=0; i<8; i++) wMatrixWabe[0][i] = code[i];
  for(let r=1; r<20; r++) { for(let c=0; c<20; c++) {
    let s = wMatrixWabe[r-1][c] + (wMatrixWabe[r-1][c+1] || 0);
    wMatrixWabe[r][c] = (s === 0) ? 0 : (s % 9 === 0 ? 9 : s % 9);
  }}
}

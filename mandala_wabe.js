var inputFieldWabe, dirSelectWabe, slidersWabe = [];
var wMatrixWabe = [];
const mapZWabe = { 1: "#FFD670", 2: "#DEAAFF", 3: "#FF686B", 4: "#7A5BEC", 5: "#74FB92", 6: "#E9FF70", 7: "#C0FDFF", 8: "#B2C9FF", 9: "#FFCBF2" };

function setupWabe() {
  var isMobile = windowWidth < 600;
  slidersWabe = [];

  // Blaue Leiste oben
  let topBar = createDiv("").addClass('app-ui').style('position', 'fixed').style('top', '0').style('left', '0').style('width', '100%')
    .style('background', '#2c3e50').style('display', 'flex').style('align-items', 'center').style('padding', '5px 10px').style('z-index', '5000').style('height', '65px');

  // Eingabe-Bereich (nach rechts verschoben wegen der Buttons)
  let inputGroup = createDiv("").parent(topBar).style('display','flex').style('flex-direction','column').style('margin-left', '75px');
  createSpan("EINGABE").parent(inputGroup).style('color','#bdc3c7').style('font-size','10px').style('font-weight','bold');
  inputFieldWabe = createInput('15011987').parent(inputGroup).style('width', isMobile ? '85px' : '130px');

  // Richtungs-Wahl (Deine Logik)
  let dirGroup = createDiv("").parent(topBar).style('display','flex').style('flex-direction','column').style('margin-left','10px');
  createSpan("RICHTUNG").parent(dirGroup).style('color','#bdc3c7').style('font-size','10px').style('font-weight','bold');
  dirSelectWabe = createSelect().parent(dirGroup);
  dirSelectWabe.option('Außen'); dirSelectWabe.option('Innen');

  // Download
  let saveBtn = createButton('DOWNLOAD').parent(topBar).addClass('app-ui').style('margin-left', 'auto').style('padding', '10px').style('background','#fff').style('border-radius','5px').style('font-weight','bold');
  saveBtn.mousePressed(() => save('Mandala_Wabe.png'));

  // Slider Panel - 75px Breite [cite: 2026-02-11]
  let panel = createDiv("").addClass('app-ui').style('position', 'fixed').style('background', 'rgba(44, 62, 80, 0.95)').style('z-index', '5000');
  if (isMobile) {
    panel.style('bottom', '0').style('left', '0').style('width', '100%').style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)').style('padding', '10px');
  } else {
    panel.style('top', '80px').style('left', '0').style('padding', '10px').style('border-radius', '0 10px 10px 0');
  }

  for (let i = 1; i <= 9; i++) {
    let sRow = createDiv("").parent(panel).style('display','flex').style('align-items','center').style('gap','5px');
    createDiv("").parent(sRow).style('width','10px').style('height','10px').style('border-radius','50%').style('background', mapZWabe[i]);
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
  
  // Deine Original-Logik Abfrage
  let code = inputFieldWabe.value().replace(/[^0-9]/g, "").split('').map(Number);
  calcWabeMatrixLogic(code);
  
  // Deine Original Spiegelungs-Logik
  for (let i = 0; i < 6; i++) {
    push();
    rotate(i * PI / 3);
    drawWabeSegment();
    pop();
  }
  pop();
}

function drawWabeSegment() {
  let size = 12;
  let h = sqrt(3) * size;
  for (let r = 0; r < 20; r++) {
    for (let c = 0; c <= r; c++) {
      let v = wMatrixWabe[r][c];
      if (v > 0) {
        let sVal = slidersWabe[v].value();
        let col = color(mapZWabe[v]);
        fill(hue(col), saturation(col) * (sVal/100), brightness(col));
        stroke(0, 40); strokeWeight(0.3);
        let x = (c - r / 2) * size * 1.5;
        let y = r * h * 0.75;
        drawHex(x, y, size);
      }
    }
  }
}

function drawHex(x, y, s) {
  beginShape();
  for (let a = 0; a < TWO_PI; a += PI / 3) {
    vertex(x + cos(a) * s, y + sin(a) * s);
  }
  endShape(CLOSE);
}

function calcWabeMatrixLogic(code) {
  wMatrixWabe = Array(20).fill().map(() => Array(20).fill(0));
  let dir = dirSelectWabe.value();
  
  if (dir === 'Außen') {
    for (let i = 0; i < code.length; i++) wMatrixWabe[19][i] = code[i];
    for (let r = 18; r >= 0; r--) {
      for (let c = 0; c <= r; c++) {
        let res = (wMatrixWabe[r+1][c] + wMatrixWabe[r+1][c+1]) % 9;
        wMatrixWabe[r][c] = (res === 0) ? 9 : res;
      }
    }
  } else {
    for (let i = 0; i < code.length; i++) wMatrixWabe[i][0] = code[i];
    for (let c = 1; c < 20; c++) {
      for (let r = c; r < 20; r++) {
        let res = (wMatrixWabe[r-1][c-1] + wMatrixWabe[r][c-1]) % 9;
        wMatrixWabe[r][c] = (res === 0) ? 9 : res;
      }
    }
  }
}

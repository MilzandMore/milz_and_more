// 1. GLOBALE VARIABLEN - WABE
var inputFieldWabe, modeSelectWabe, dirSelectWabe, colorIndicatorsWabe = [];
var wMatrixWabe = [];
var codeDisplayWabe;

const mapZWabe = { 1: "#FFD670", 2: "#DEAAFF", 3: "#FF686B", 4: "#7A5BEC", 5: "#74FB92", 6: "#E9FF70", 7: "#C0FDFF", 8: "#B2C9FF", 9: "#FFCBF2" };
var colorMatrixWabe = {
  1: { 1: "#FF0000", 2: "#0000FF", 3: "#00FF00", 4: "#FFFF00", 5: "#00B0F0", 6: "#00FFFF", 7: "#FF66FF", 8: "#FF9900", 9: "#9900FF" },
  // ... (Restliche Matrix wie gehabt)
  2:{1:"#0000FF",2:"#00FF00",3:"#FFFF00",4:"#00B0F0",5:"#00FFFF",6:"#FF66FF",7:"#FF9900",8:"#9900FF",9:"#FF0000"},3:{1:"#00FF00",2:"#FFFF00",3:"#00B0F0",4:"#00FFFF",5:"#FF66FF",6:"#FF9900",7:"#9900FF",8:"#FF0000",9:"#0000FF"},4:{1:"#FFFF00",2:"#00B0F0",3:"#00FFFF",4:"#FF66FF",5:"#FF9900",6:"#9900FF",7:"#FF0000",8:"#0000FF",9:"#00FF00"},5:{1:"#00B0F0",2:"#00FFFF",3:"#FF66FF",4:"#FF9900",5:"#9900FF",6:"#FF0000",7:"#0000FF",8:"#00FF00",9:"#FFFF00"},6:{1:"#00FFFF",2:"#FF66FF",3:"#FF9900",4:"#9900FF",5:"#FF0000",6:"#0000FF",7:"#00FF00",8:"#FFFF00",9:"#00B0F0"},7:{1:"#FF66FF",2:"#FF9900",3:"#9900FF",4:"#FF0000",5:"#0000FF",6:"#00FF00",7:"#FFFF00",8:"#00B0F0",9:"#00FFFF"},8:{1:"#FF9900",2:"#9900FF",3:"#FF0000",4:"#0000FF",5:"#00FF00",6:"#FFFF00",7:"#00B0F0",8:"#00FFFF",9:"#FF66FF"},9:{1:"#9900FF",2:"#FF0000",3:"#0000FF",4:"#00FF00",5:"#FFFF00",6:"#00B0F0",7:"#00FFFF",8:"#FF66FF",9:"#FF9900"}
};

function setupWabe() {
  var isMobile = windowWidth < 600;
  slidersWabe = [];

  // TOPBAR
  topBarWabe = createDiv("").addClass('app-ui').style('position', 'fixed').style('top', '0').style('left', '0').style('width', '100%')
    .style('background', '#2c3e50').style('display', 'flex').style('align-items', 'center').style('padding', isMobile ? '5px' : '10px')
    .style('gap', '10px').style('z-index', '100').style('box-sizing', 'border-box').style('height', isMobile ? '60px' : '80px');

  // Eingabe Gruppe
  let inputGroup = createDiv("").parent(topBarWabe).style('margin-left', '80px').style('display','flex').style('flex-direction','column');
  createSpan("EINGABE").parent(inputGroup).style('color','#bdc3c7').style('font-size','9px');
  inputFieldWabe = createInput('15011987').parent(inputGroup).style('width', isMobile ? '80px' : '120px');

  // Richtung Gruppe
  let dirGroup = createDiv("").parent(topBarWabe).style('display','flex').style('flex-direction','column');
  createSpan("RICHTUNG").parent(dirGroup).style('color','#bdc3c7').style('font-size','9px');
  dirSelectWabe = createSelect().parent(dirGroup);
  dirSelectWabe.option('Außen'); dirSelectWabe.option('Innen');

  // Download
  var saveBtn = createButton('DOWNLOAD').parent(topBarWabe).addClass('app-ui')
    .style('margin-left', 'auto').style('padding', '8px').style('font-weight','bold');
  saveBtn.mousePressed(exportHighResWabe);

  // SLIDER PANEL
  sliderPanelWabe = createDiv("").addClass('app-ui').style('position', 'fixed').style('background', 'rgba(44, 62, 80, 0.95)').style('z-index', '150');
  
  if (isMobile) {
    sliderPanelWabe.style('bottom', '0').style('left', '0').style('width', '100%').style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)').style('padding', '10px');
  } else {
    sliderPanelWabe.style('top', '90px').style('left', '0').style('width', 'auto').style('display', 'flex').style('flex-direction', 'column').style('padding', '10px').style('border-radius', '0 10px 10px 0');
  }

  for (var i = 1; i <= 9; i++) {
    var sRow = createDiv("").parent(sliderPanelWabe).style('display','flex').style('align-items','center').style('gap','5px').style('margin-bottom','5px');
    createDiv("").parent(sRow).style('width','10px').style('height','10px').style('border-radius','50%').style('background', mapZWabe[i]);
    slidersWabe[i] = createSlider(20, 100, 85).parent(sRow).style('width', '75px');
    slidersWabe[i].input(() => redraw());
  }

  [inputFieldWabe, dirSelectWabe].forEach(e => e.input(redraw));
}

function drawWabe() {
  var isMobile = windowWidth < 600;
  var val = inputFieldWabe.value().replace(/[^0-9]/g, "");
  var code = val.split('').map(Number);
  while(code.length < 8) code.push(0);
  code = code.slice(0, 8);
  var startDigit = code[0] || 1;
  var drawCode = (dirSelectWabe.value() === 'Innen') ? [...code].reverse() : code;

  push();
  translate(width/2, isMobile ? height/2 - 50 : height/2 + 20);
  scale(isMobile ? 0.7 : 1);
  calcWabeMatrixLogic(drawCode);
  drawWabeShape(startDigit);
  pop();
}

function drawWabeShape(startDigit, target) {
  var ctx = target || window;
  var size = 12;
  var h = sqrt(3) * size;
  ctx.stroke(0, 40);
  ctx.strokeWeight(0.2);
  for (var r = 0; r < 20; r++) {
    for (var c = 0; c < 20; c++) {
      var v = wMatrixWabe[r][c];
      if (v === 0) continue;
      var hex = (colorMatrixWabe[startDigit] && colorMatrixWabe[startDigit][v]) ? colorMatrixWabe[startDigit][v] : mapZWabe[v];
      var sVal = slidersWabe[v] ? slidersWabe[v].value() : 85;
      var col = color(hex);
      ctx.fill(hue(col), saturation(col) * (sVal/100), brightness(col));
      
      let x = c * size * 1.5;
      let y = r * h + (c % 2 === 0 ? 0 : h / 2);
      
      // Zeichnet die 6 Symmetrie-Segmente
      for(let a=0; a<6; a++) {
        ctx.push(); ctx.rotate(PI/3 * a);
        drawHexagon(x, y, size, ctx);
        ctx.pop();
      }
    }
  }
}

function drawHexagon(x, y, s, ctx) {
  ctx.beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = PI / 3 * i;
    ctx.vertex(x + cos(angle) * s, y + sin(angle) * s);
  }
  ctx.endShape(CLOSE);
}

function calcWabeMatrixLogic(code) {
  wMatrixWabe = Array(20).fill().map(() => Array(20).fill(0));
  for(let i=0; i<8; i++) wMatrixWabe[0][i] = code[i];
  for(let r=1; r<20; r++) {
    for(let c=0; c<20; c++) {
      let a = wMatrixWabe[r-1][c];
      let b = wMatrixWabe[r-1][c+1] || 0;
      let s = a + b;
      wMatrixWabe[r][c] = (s === 0) ? 0 : (s % 9 === 0 ? 9 : s % 9);
    }
  }
}

function exportHighResWabe() {
  let pg = createGraphics(2480, 3508);
  pg.background(255);
  pg.translate(pg.width/2, pg.height/2);
  pg.scale(4);
  var val = inputFieldWabe.value().replace(/[^0-9]/g, "");
  var code = val.split('').map(Number);
  while(code.length < 8) code.push(0);
  drawWabeShape(code[0] || 1, pg);
  save(pg, 'Mandala_Wabe.png');
}

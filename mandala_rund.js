var inputFieldRund, sektorSelectRund, slidersRund = [];
const mapZRund = { 1: "#FFD670", 2: "#DEAAFF", 3: "#FF686B", 4: "#7A5BEC", 5: "#74FB92", 6: "#E9FF70", 7: "#C0FDFF", 8: "#B2C9FF", 9: "#FFCBF2" };

function setupRund() {
  var isMobile = windowWidth < 600; slidersRund = [];
  let topBar = createDiv("").addClass('app-ui').style('position', 'fixed').style('top', '0').style('left', '0').style('width', '100%')
    .style('background', '#2c3e50').style('display', 'flex').style('align-items', 'center').style('padding', '5px 10px').style('z-index', '5000').style('height', '65px');

  let inputGroup = createDiv("").parent(topBar).style('display','flex').style('flex-direction','column').style('margin-left', '75px');
  inputFieldRund = createInput('15011987').parent(inputGroup).style('width', isMobile ? '80px' : '120px');

  let saveBtn = createButton('DOWNLOAD').parent(topBar).addClass('app-ui').style('margin-left', 'auto').style('padding', '10px').style('background','#fff').style('font-weight','bold');
  saveBtn.mousePressed(() => save('Rund.png'));

  let panel = createDiv("").addClass('app-ui').style('position', 'fixed').style('background', 'rgba(44, 62, 80, 0.95)').style('z-index', '5000');
  if (isMobile) {
    panel.style('bottom', '0').style('width', '100%').style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)');
  } else {
    panel.style('top', '80px').style('left', '0').style('padding', '10px');
  }

  for (let i = 1; i <= 9; i++) {
    let sRow = createDiv("").parent(panel).style('display','flex').style('align-items','center').style('padding','2px');
    slidersRund[i] = createSlider(20, 100, 85).parent(sRow).style('width', '75px'); // [cite: 2026-02-11]
  }
}

function drawRund() {
  let isMobile = windowWidth < 600;
  push();
  translate(width/2, isMobile ? height/2 - 20 : height/2 + 40);
  scale(isMobile ? 1.5 : 2.2); // GRÖSSENANPASSUNG
  let code = inputFieldRund.value().split('').map(Number);
  for(let i=0; i<12; i++) {
    push(); rotate(TWO_PI/12 * i);
    drawSektorRund(code);
    pop();
  }
  pop();
}

function drawSektorRund(code) {
  for(let r=0; r<code.length; r++) {
    let val = code[r] || 1;
    fill(color(mapZRund[val])); noStroke();
    arc(0, 0, (r+1)*24, (r+1)*24, 0, TWO_PI/12 + 0.01);
  }
}

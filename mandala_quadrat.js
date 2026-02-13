var inputFieldQuad, slidersQuad = [];
const mapZQuad = { 1: "#FFD670", 2: "#DEAAFF", 3: "#FF686B", 4: "#7A5BEC", 5: "#74FB92", 6: "#E9FF70", 7: "#C0FDFF", 8: "#B2C9FF", 9: "#FFCBF2" };

function setupQuadrat() {
  var isMobile = windowWidth < 600; slidersQuad = [];
  let topBar = createDiv("").addClass('app-ui').style('position', 'fixed').style('top', '0').style('left', '0').style('width', '100%')
    .style('background', '#2c3e50').style('display', 'flex').style('align-items', 'center').style('padding', '5px 10px').style('z-index', '5000').style('height', '65px');

  let inputGroup = createDiv("").parent(topBar).style('display','flex').style('flex-direction','column').style('margin-left', '75px');
  inputFieldQuad = createInput('15011987').parent(inputGroup);

  let saveBtn = createButton('DOWNLOAD').parent(topBar).addClass('app-ui').style('margin-left', 'auto').style('padding', '10px').style('background','#fff').style('font-weight','bold');
  saveBtn.mousePressed(() => save('Quadrat.png'));

  let panel = createDiv("").addClass('app-ui').style('position', 'fixed').style('background', 'rgba(44, 62, 80, 0.95)').style('z-index', '5000');
  if (isMobile) { panel.style('bottom', '0').style('width', '100%').style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)'); }
  else { panel.style('top', '80px').style('left', '0').style('padding', '10px'); }

  for (let i = 1; i <= 9; i++) {
    let sRow = createDiv("").parent(panel).style('display','flex').style('align-items','center').style('padding','2px');
    slidersQuad[i] = createSlider(20, 100, 85).parent(sRow).style('width', '75px'); // [cite: 2026-02-11]
  }
}

function drawQuadrat() {
  let isMobile = windowWidth < 600;
  push();
  translate(width/2, isMobile ? height/2 - 20 : height/2 + 40);
  scale(isMobile ? 1.4 : 2.0); // GRÖSSENANPASSUNG
  let code = inputFieldQuad.value().split('').map(Number);
  let s = 15;
  for(let r=-10; r<10; r++) {
    for(let c=-10; c<10; c++) {
      let val = code[abs(r+c)%code.length] || 1;
      fill(color(mapZQuad[val])); noStroke();
      rect(c*s, r*s, s, s);
    }
  }
  pop();
}

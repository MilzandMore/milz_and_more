var inputFieldRund, sektorSelectRund, slidersRund = [];
const mapZRund = { 1: "#FFD670", 2: "#DEAAFF", 3: "#FF686B", 4: "#7A5BEC", 5: "#74FB92", 6: "#E9FF70", 7: "#C0FDFF", 8: "#B2C9FF", 9: "#FFCBF2" };

function setupRund() {
  var isMobile = windowWidth < 600;
  slidersRund = [];

  let topBar = createDiv("").addClass('app-ui').style('position', 'fixed').style('top', '0').style('left', '0').style('width', '100%')
    .style('background', '#2c3e50').style('display', 'flex').style('align-items', 'center').style('padding', '5px 10px')
    .style('gap', '10px').style('z-index', '5000').style('height', '65px').style('box-sizing','border-box');

  let inputGroup = createDiv("").parent(topBar).style('display','flex').style('flex-direction','column').style('margin-left', '60px');
  createSpan("EINGABE").parent(inputGroup).style('color','#bdc3c7').style('font-size','10px');
  inputFieldRund = createInput('15011987').parent(inputGroup).style('width', isMobile ? '80px' : '120px');

  let sektorGroup = createDiv("").parent(topBar).style('display','flex').style('flex-direction','column');
  createSpan("SEKTOR").parent(sektorGroup).style('color','#bdc3c7').style('font-size','10px');
  sektorSelectRund = createSelect().parent(sektorGroup);
  [8,12,16,24].forEach(n => sektorSelectRund.option(n));

  let saveBtn = createButton('DOWNLOAD').parent(topBar).addClass('app-ui').style('margin-left', 'auto').style('padding', '8px 15px').style('background','#fff').style('border-radius','5px').style('font-weight','bold');
  saveBtn.mousePressed(() => save('Mandala_Rund.png'));

  let panel = createDiv("").addClass('app-ui').style('position', 'fixed').style('background', 'rgba(44, 62, 80, 0.95)').style('z-index', '5000');
  if (isMobile) {
    panel.style('bottom', '0').style('left', '0').style('width', '100%').style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)').style('padding', '10px');
  } else {
    panel.style('top', '80px').style('left', '0').style('padding', '10px').style('border-radius', '0 10px 10px 0');
  }

  for (let i = 1; i <= 9; i++) {
    let sRow = createDiv("").parent(panel).style('display','flex').style('align-items','center').style('gap','5px');
    createDiv("").parent(sRow).style('width','10px').style('height','10px').style('border-radius','50%').style('background', mapZRund[i]);
    slidersRund[i] = createSlider(20, 100, 85).parent(sRow).style('width', '75px');
    slidersRund[i].input(() => redraw());
  }
  [inputFieldRund, sektorSelectRund].forEach(e => e.input(redraw));
}

function drawRund() {
  let isMobile = windowWidth < 600;
  push();
  translate(width/2, isMobile ? height/2 - 20 : height/2 + 40);
  scale(isMobile ? 1.3 : 1.8); // MASSIV VERGRÖSSERT
  let code = inputFieldRund.value().split('').map(Number);
  let sektoren = int(sektorSelectRund.value());
  for(let i=0; i<sektoren; i++) {
    push(); rotate(TWO_PI/sektoren * i); 
    let rBase = 12;
    for(let r=0; r<code.length; r++) {
      let val = code[r] || 1;
      let col = color(mapZRund[val]);
      let sVal = slidersRund[val].value();
      fill(hue(col), saturation(col)*(sVal/100), brightness(col));
      noStroke(); arc(0, 0, (r+1)*rBase*2, (r+1)*rBase*2, 0, TWO_PI/sektoren);
    }
    pop();
  }
  pop();
}

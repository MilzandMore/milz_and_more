// --- GLOBALE VARIABLEN (Definitionen zur Fehlerbehebung) ---
let inputField, designSelect, modeSelect, dirSelect, sektSelect, saveBtn;
let sliders = [];
let colorIndicators = []; 
let logoImg, qMatrix = [];

const charMap = { 'A':1,'J':1,'S':1,'Ä':1,'B':2,'K':2,'T':2,'Ö':2,'C':3,'L':3,'U':3,'Ü':3,'D':4,'M':4,'V':4,'ß':4, 'E':5,'N':5,'W':5,'F':6,'O':6,'X':6,'G':7,'P':7,'Y':7,'H':8,'Q':8,'Z':8,'I':9,'R':9 };
const baseColors = ["#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3"];

function preload() {
  logoImg = loadImage('logo.png', () => {}, () => {
    logoImg = loadImage('Logo.png', () => {}, () => console.log("Logo fehlt"));
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  
  let sidebar = createDiv('').id('ui-sidebar');
  addStyles(); 

  designSelect = createSelect().parent(sidebar).addClass('ui-select');
  ['Quadrat', 'Rund', 'Wabe'].forEach(d => designSelect.option(d));
  inputField = createInput('15011987').parent(sidebar).addClass('ui-input');
  modeSelect = createSelect().parent(sidebar).addClass('ui-select');
  modeSelect.option('Geburtstag'); modeSelect.option('Text');
  dirSelect = createSelect().parent(sidebar).addClass('ui-select');
  dirSelect.option('Außen'); dirSelect.option('Innen');
  sektSelect = createSelect().parent(sidebar).addClass('ui-select');
  ["6","8","10","12"].forEach(s => sektSelect.option(s)); sektSelect.selected("8");

  let sliderGrid = createDiv('').parent(sidebar).addClass('slider-grid');
  for (let i = 1; i <= 9; i++) {
    let row = createDiv('').parent(sliderGrid).addClass('slider-row');
    colorIndicators[i] = createDiv('').parent(row).addClass('color-dot');
    sliders[i] = createSlider(20, 100, 85).parent(row).style('width', '75px').input(redraw);
  }

  saveBtn = createButton('DESIGN DOWNLOADEN').parent(sidebar).addClass('ui-btn');
  saveBtn.mousePressed(exportHighRes);

  [designSelect, modeSelect, dirSelect, sektSelect].forEach(s => s.changed(redraw));
  inputField.input(redraw);
  noLoop();
}

// --- DEINE RECHENLOGIK (1:1 WIE IM ORIGINAL) ---

function ex(a, b) { let s = (a||0)+(b||0); return s===0?0:(s%9===0?9:s%9); }

function getCode() {
  let val = inputField.value().toUpperCase();
  if (modeSelect.value() === 'Geburtstag') {
    let d = val.replace(/\D/g, "").split("").map(Number);
    if(d.length < 1) return null;
    while(d.length < 8) d.push(0);
    return d.slice(0, 8);
  } else {
    let chars = val.replace(/[^A-ZÄÖÜß]/g, "").split("").map(c => charMap[c] || 0);
    if (chars.length === 0) return [1,1,1,1,1,1,1,1];
    let row = chars;
    while(row.length < 8) row.push(9);
    while(row.length > 8) {
      let next = [];
      for (let i=0; i<row.length-1; i++) next.push(ex(row[i], row[i+1]));
      row = next;
    }
    return row;
  }
}

function calcQuadratMatrix(code) {
  qMatrix = Array(20).fill().map(() => Array(20).fill(0));
  let d=[code[0],code[1]], m=[code[2],code[3]], j1=[code[4],code[5]], j2=[code[6],code[7]];
  const set2 = (r,c,v1,v2) => { if(r<19&&c<19){ qMatrix[r][c]=v1; qMatrix[r][c+1]=v2; qMatrix[r+1][c]=v2; qMatrix[r+1][c+1]=v1; } };
  for(let i=0; i<8; i+=2) set2(i,i,d[0],d[1]);
  for(let i=0; i<6; i+=2) { set2(i,i+2,m[0],m[1]); set2(i+2,i,m[0],m[1]); }
  for(let i=0; i<4; i+=2) { set2(i,i+4,j1[0],j1[1]); set2(i+4,i,j1[0],j1[1]); }
  set2(0,6,j2[0],j2[1]); set2(6,0,j2[0],j2[1]);
  for(let r=0; r<8; r++) for(let c=8; c<20; c++) qMatrix[r][c]=ex(qMatrix[r][c-2], qMatrix[r][c-1]);
  for(let c=0; c<20; c++) for(let r=8; r<20; r++) qMatrix[r][c]=ex(qMatrix[r-2][c], qMatrix[r-1][c]);
}

// --- DEINE ZEICHENLOGIKEN (KOMPLETT ZURÜCKGESETZT AUF DEIN ORIGINAL) ---

function drawQuadrat(colors, target) {
  let ctx=target||window; let ts=16; ctx.stroke(0,30); ctx.strokeWeight(0.5);
  for(let r=0;r<20;r++) for(let c=0;c<20;c++) {
    let v=qMatrix[r][c]; if(v>0){ ctx.fill(getSliderColor(colors[v-1],v));
    ctx.rect(c*ts,-(r+1)*ts,ts,ts); ctx.rect(-(c+1)*ts,-(r+1)*ts,ts,ts);
    ctx.rect(c*ts,r*ts,ts,ts); ctx.rect(-(c+1)*ts,r*ts,ts,ts); }
  }
}

function drawRund(code, colors, target) {
  let ctx=target||window; let sc=int(sektSelect.value()); let angle=TWO_PI/sc;
  let frame=dirSelect.value()==='Innen'?[...code].reverse():[...code];
  let base=[...frame].reverse().concat(frame);
  let m=Array.from({length:16},(_,r)=>Array(r+1).fill(0));
  for(let i=0;i<16;i++){ m[15][i]=base[i]; m[i][0]=base[i]; m[i][i]=base[i]; }
  for(let r=14;r>=0;r--) for(let c=1;c<r;c++) m[r][c]=ex(m[r+1][c],m[r+1][c+1]);
  for(let i=0;i<sc;i++){ ctx.push(); ctx.rotate(i*angle); let step=20, h=tan(angle/2)*step; ctx.stroke(0,30);
    for(let r=0;r<16;r++) for(let c=0;c<=r;c++){ let v=m[r][c]; if(v>0){ ctx.fill(getSliderColor(colors[v-1],v));
      let x=r*step, y=(c-r/2)*h*2; ctx.beginShape(); ctx.vertex(x,y); ctx.vertex(x+step,y-h); ctx.vertex(x+step*2,y); ctx.vertex(x+step,y+h); ctx.endShape(CLOSE); }}
  ctx.pop(); }
}

function drawWabe(code, colors, target) {
  let ctx=target||window; let sz=16.2; let path=dirSelect.value()==='Innen'?[...code,...[...code].reverse()]:[...[...code].reverse(),...code];
  ctx.stroke(0,30); ctx.strokeWeight(0.5);
  for(let s=0;s<6;s++){ ctx.push(); ctx.rotate(s*PI/3);
    let m=Array(17).fill().map(()=>Array(17).fill(0)); for(let i=0;i<16;i++) m[16][i]=path[i % path.length];
    for(let r=15;r>=1;r--) for(let i=0;i<r;i++) m[r][i]=ex(m[r+1][i],m[r+1][i+1]);
    for(let r=1;r<=16;r++) for(let i=0;i<r;i++){ if(m[r][i]>0){ ctx.fill(getSliderColor(colors[m[r][i]-1],m[r][i]));
      let x=(i-(r-1)/2)*sz*sqrt(3), y=-(r-1)*sz*1.5; ctx.beginShape(); for(let a=PI/6;a<TWO_PI;a+=PI/3) ctx.vertex(x+cos(a)*sz,y+sin(a)*sz); ctx.endShape(CLOSE); }}
  ctx.pop(); }
}

// --- STEUERUNG (NUR HIER VERKNÜPFUNG ZUM UI) ---

function draw() {
  background(255);
  let code = getCode();
  if (!code) return;
  let currentColors = getColorSet(code[0] || 1);
  for (let i = 1; i <= 9; i++) { if(colorIndicators[i]) colorIndicators[i].style('background-color', currentColors[i-1]); }
  
  push();
  let offsetX = windowWidth > 600 ? -140 : 0;
  translate(width / 2 + offsetX, height / 2);
  let design = designSelect.value();
  let sc = (min(width, height) / 900);
  
  if (design === 'Quadrat') { scale(sc * 0.9); calcQuadratMatrix(dirSelect.value()==='Innen' ? [...code].reverse() : code); drawQuadrat(currentColors); }
  else if (design === 'Rund') { scale(sc * 0.95); drawRund(code, currentColors); }
  else { scale(sc * 1.8); drawWabe(code, currentColors); }
  pop();

  if (logoImg && logoImg.width > 0) {
    let lW = windowWidth < 600 ? 60 : 150;
    image(logoImg, 30, height - 100, lW, (logoImg.height/logoImg.width)*lW);
  }
}

function getSliderColor(cStr, val) {
  let col = color(cStr);
  let sVal = sliders[val].value();
  return color(hue(col), map(sVal, 20, 100, 15, saturation(col)), map(sVal, 20, 100, 98, brightness(col)));
}

function getColorSet(seed) {
  let shift = (seed - 1) % 9;
  return baseColors.slice(shift).concat(baseColors.slice(0, shift));
}

function addStyles() {
  createElement('style', `
    #ui-sidebar { position: fixed; top: 20px; right: 20px; width: 280px; background: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); font-family: sans-serif; z-index: 1000; }
    .ui-select, .ui-input { width: 100%; padding: 8px; margin-bottom: 12px; border: 1px solid #ccc; border-radius: 5px; }
    .ui-btn { width: 100%; padding: 10px; background: #333; color: white; border: none; border-radius: 5px; cursor: pointer; }
    .slider-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .slider-row { display: flex; align-items: center; }
    .color-dot { width: 10px; height: 10px; border-radius: 50%; margin-right: 5px; }
  `);
}

function exportHighRes() {
  let pg = createGraphics(2480, 3508);
  pg.colorMode(HSB, 360, 100, 100); pg.background(255);
  let code = getCode(); let colors = getColorSet(code[0]||1);
  pg.push(); pg.translate(pg.width/2, pg.height*0.45);
  let design = designSelect.value();
  if(design==='Quadrat'){ pg.scale(4); calcQuadratMatrix(dirSelect.value()==='Innen'?[...code].reverse():code); drawQuadrat(colors, pg); }
  else if(design==='Rund'){ pg.scale(3.5); drawRund(code, colors, pg); }
  else { pg.scale(2.5); drawWabe(code, colors, pg); }
  pg.pop();
  save(pg, `Mandala_${design}.png`);
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); redraw(); }

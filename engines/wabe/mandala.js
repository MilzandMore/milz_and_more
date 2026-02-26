let APP = {
  engine: "wabe",
  mode: "geburtstag",
  input: "15011987",
  direction: "aussen",
  sector: 8,
  sliders: Array(10).fill(85),
  isAdmin: false
};

var colorMatrix = {
  1: ["#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3"],
  2: ["#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3", "#FF0000"],
  3: ["#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3", "#FF0000", "#00008B"],
  4: ["#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3", "#FF0000", "#00008B", "#00FF00"],
  5: ["#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3", "#FF0000", "#00008B", "#00FF00", "#FFFF00"],
  6: ["#40E0D0", "#FFC0CB", "#FFA500", "#9400D3", "#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB"],
  7: ["#FFC0CB", "#FFA500", "#9400D3", "#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0"],
  8: ["#FFA500", "#9400D3", "#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB"],
  9: ["#9400D3", "#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500"]
};

var charMap = {
  'A':1,'J':1,'S':1,'Ä':1,'B':2,'K':2,'T':2,'Ö':2,'C':3,'L':3,'U':3,'Ü':3,'D':4,'M':4,'V':4,'ß':4,
  'E':5,'N':5,'W':5,'F':6,'O':6,'X':6,'G':7,'P':7,'Y':7,'H':8,'Q':8,'Z':8,'I':9,'R':9
};

var ex = (a, b) => (a + b === 0) ? 0 : ((a + b) % 9 === 0 ? 9 : (a + b) % 9);

let logoImg;
let isAdmin = false;

function sendReady(){ if(window.parent) window.parent.postMessage({type:"READY"}, "*"); }
function sendColors(colors){ if(window.parent) window.parent.postMessage({type:"COLORS", colors}, "*"); }

window.addEventListener("message",(ev)=>{
  const msg = ev.data;
  if(!msg || typeof msg!=="object") return;
  if(msg.type==="SET_STATE" && msg.payload){
    APP = msg.payload;
    isAdmin = !!APP.isAdmin;
    redraw();
  }
  if(msg.type==="EXPORT"){
    if(msg.payload){ APP = msg.payload; isAdmin = !!APP.isAdmin; }
    exportHighRes();
  }
});

function preload(){ logoImg = loadImage('../../assets/Logo.png'); }

function setup(){
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  smooth(8);
  noLoop();
  sendReady();
  redraw();
}

function draw(){
  background(12);

  const rawVal = String(APP.input || "").trim();
  if(rawVal === "" || (APP.mode==="geburtstag" && rawVal.replace(/\D/g,"").length===0)) return;

  let code = (APP.mode==="text") ? getCodeFromText(rawVal) : rawVal.replace(/\D/g,"").split('').map(Number);
  while(code.length<8) code.push(0);
  code = code.slice(0,8);

  if(code.every(v=>v===0)) return;

  const cKey = code[0] || 1;

  // dot colors
  sendColors(colorMatrix[cKey]);

  push();
  const isMobile = windowWidth < 600;
  const yOffset = isMobile ? -10 : 10;
  translate(width/2, height/2 + yOffset);

  const scaleFactor = (min(width, height) / 520) * (isMobile ? 0.45 : 0.48);
  scale(scaleFactor);

  renderWabeKorrekt(code, cKey);
  pop();
}

function renderWabeKorrekt(code, cKey, target){
  const ctx = target || window;
  const sz = 16.2;

  ctx.stroke(255, 18);
  ctx.strokeWeight(0.6);

  const path = (APP.direction === "innen")
    ? [...code, ...[...code].reverse()]
    : [...[...code].reverse(), ...code];

  for(let s=0;s<6;s++){
    ctx.push();
    ctx.rotate(s * PI / 3);

    const m = Array(17).fill().map(()=>Array(17).fill(0));
    for(let i=0;i<16;i++) m[16][i] = path[i % path.length];

    for(let r=15;r>=1;r--) for(let i=0;i<r;i++) m[r][i] = ex(m[r+1][i], m[r+1][i+1]);

    for(let r=1;r<=16;r++){
      for(let i=0;i<r;i++){
        const val = m[r][i];
        if(val>=1 && val<=9){
          const col = color(colorMatrix[cKey][val-1]);
          const sVal = (APP.sliders && APP.sliders[val]) ? APP.sliders[val] : 85;
          ctx.fill(
            hue(col),
            map(sVal, 20, 100, 15, saturation(col)),
            map(sVal, 20, 100, 98, brightness(col))
          );
        } else {
          ctx.fill(12);
        }

        const x = (i - (r - 1) / 2) * sz * sqrt(3);
        const y = -(r - 1) * sz * 1.5;

        ctx.beginShape();
        for(let a = PI/6; a < TWO_PI; a += PI/3) ctx.vertex(x + cos(a)*sz, y + sin(a)*sz);
        ctx.endShape(CLOSE);
      }
    }

    ctx.pop();
  }
}

function exportHighRes(){
  const exportW=2480, exportH=3508;
  const pg = createGraphics(exportW, exportH);
  pg.colorMode(HSB, 360, 100, 100);
  pg.background(255);

  const rawVal = String(APP.input||"").trim();
  let code = (APP.mode==="text") ? getCodeFromText(rawVal) : rawVal.replace(/\D/g,"").split('').map(Number);
  while(code.length<8) code.push(0);
  code = code.slice(0,8);

  const cKey = code[0] || 1;

  pg.push();
  pg.translate(exportW/2, exportH*0.40);
  pg.scale(2.4);
  renderWabeKorrekt(code, cKey, pg);
  pg.pop();

  if(logoImg && !isAdmin){
    pg.resetMatrix(); pg.tint(255, 0.45);
    const wWidth=380, wHeight=(logoImg.height/logoImg.width)*wWidth;
    for(let x=-100;x<exportW+400;x+=500){
      for(let y=-100;y<exportH+400;y+=500) pg.image(logoImg, x, y, wWidth, wHeight);
    }
    pg.noTint();
  }

  if(logoImg){
    const lW=500, lH=(logoImg.height/logoImg.width)*lW;
    pg.image(logoImg, exportW-lW-100, exportH-lH-100, lW, lH);
  }

  save(pg, 'Milz&More_Wabe.png');
}

function getCodeFromText(textStr){
  const cleanText = String(textStr||"").toUpperCase().replace(/[^A-ZÄÖÜß]/g,"");
  if(cleanText.length===0) return [0,0,0,0,0,0,0,0];

  let currentRow = cleanText.split("").map(c => charMap[c]).filter(n => n);
  while(currentRow.length<8) currentRow.push(9);

  while(currentRow.length>8){
    const nextRow=[];
    for(let i=0;i<currentRow.length-1;i++) nextRow.push(ex(currentRow[i], currentRow[i+1]));
    currentRow=nextRow;
  }
  return currentRow;
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}

// --------- STATE (kommt vom Parent) ----------
let APP = {
  engine: "rund",
  mode: "geburtstag",      // geburtstag | text (text = affirmation)
  input: "15011987",
  direction: "aussen",     // aussen | innen
  sector: 8,
  sliders: Array(10).fill(85),
  isAdmin: false
};

// original constants
var baseColors = ["#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3"];

var affirmMap = { 
  A:1,J:1,S:1,Ä:1, B:2,K:2,T:2,Ö:2, C:3,L:3,U:3,Ü:3, D:4,M:4,V:4,ß:4, 
  E:5,N:5,W:5, F:6,O:6,X:6, G:7,P:7,Y:7, H:8,Q:8,Z:8, I:9,R:9 
};

var ex = (a,b) => (a + b) % 9 === 0 ? 9 : (a + b) % 9;

let logoImg;
let colorSeed = 1;
let isAdmin = false;

// messaging
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

function preload() {
  const p = (APP && APP.exportLogo) ? APP.exportLogo : "../../assets/Logo_black.png";
  logoImg = loadImage(
    p,
    () => {},
    () => { logoImg = loadImage("../../assets/Logo.png"); }
  );
}

function setup(){
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  noLoop();
  sendReady();
  redraw();
}

function draw(){
  background(12);

  const rawVal = String(APP.input || "").trim();
  if(rawVal === "" || (APP.mode==="geburtstag" && rawVal.replace(/\D/g,"").length===0)) return;

  const sector = buildSector();
  const currentColors = getColorMatrix(colorSeed);

  // dot colors
  sendColors(currentColors);

  push();
  const isMobile = windowWidth < 600;
  const centerY = isMobile ? height/2 - 10 : height/2 + 10;
  const centerX = width/2;
  translate(centerX, centerY);

  const scaleFactor = (min(width, height) / 900) * (isMobile ? 0.85 : 0.95);
  scale(scaleFactor);

  const sc = int(APP.sector || 8);
  const angle = TWO_PI / sc;
  for(let i=0;i<sc;i++){
    push();
    rotate(i*angle);
    drawSector(sector, currentColors);
    pop();
  }
  pop();
}

function drawSector(m, colors, target){
  const ctx = target || window;
  const step = 20;
  const sc = int(APP.sector || 8);
  const angle = TWO_PI / sc;
  const h = tan(angle/2) * step;

  ctx.stroke(255, 18);
  ctx.strokeWeight(0.6);

  for(let r=0;r<m.length;r++){
    for(let c=0;c<=r;c++){
      const v = m[r][c];
      const x = r*step;
      const y = (c - r/2) * h * 2;

      if(v>=1 && v<=9){
        const baseCol = color(colors[v-1]);
        const sVal = (APP.sliders && APP.sliders[v]) ? APP.sliders[v] : 85;
        ctx.fill(
          hue(baseCol),
          map(sVal, 20, 100, 15, saturation(baseCol)),
          map(sVal, 20, 100, 98, brightness(baseCol))
        );
      } else {
        ctx.fill(12);
      }

      ctx.beginShape();
      ctx.vertex(x, y);
      ctx.vertex(x + step, y - h);
      ctx.vertex(x + step * 2, y);
      ctx.vertex(x + step, y + h);
      ctx.endShape(CLOSE);
    }
  }
}

function exportHighRes(){
  const exportW=2480, exportH=3508;
  const pg = createGraphics(exportW, exportH);
  pg.colorMode(HSB, 360, 100, 100);
  pg.background(255);

  const sector = buildSector();
  const currentColors = getColorMatrix(colorSeed);
  const sc = int(APP.sector || 8);
  const angle = TWO_PI / sc;

  pg.push();
  pg.translate(exportW/2, exportH*0.40);
  pg.scale(3.2);
  for(let i=0;i<sc;i++){
    pg.push();
    pg.rotate(i*angle);
    drawSector(sector, currentColors, pg);
    pg.pop();
  }
  pg.pop();

  if(logoImg && !isAdmin){
    pg.resetMatrix(); pg.tint(255,0.45);
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

  save(pg, 'Milz&More_Rund.png');
}

function buildSector(){
  const n=16;
  const m = Array.from({length:n}, (_,r)=>Array(r+1).fill(0));

  const isText = (APP.mode === "text");
  let raw = isText ? codeFromAffirm(APP.input) : String(APP.input||"").replace(/\D/g,"").split("").map(Number);

  while(raw.length<8) raw.push(0);
  raw = raw.slice(0,8);

  colorSeed = raw[0] || 1;

  const frame = (APP.direction==="innen") ? [...raw].reverse() : [...raw];
  const base = [...frame].reverse().concat(frame);

  for(let i=0;i<16;i++) m[15][i] = base[i];
  for(let i=0;i<16;i++){ const r=15-i; m[r][0]=base[i]; m[r][r]=base[i]; }

  for(let c=1;c<=13;c++) m[14][c]=ex(m[15][c], m[15][c+1]);
  const c14=(c,t)=>t.forEach(([r,k])=>m[r][k]=m[14][c]);
  c14(1, [[2,1]]);
  c14(2, [[3,1],[3,2],[13,1],[13,12]]);
  c14(3, [[4,1],[4,3],[12,1],[12,11]]);
  c14(4, [[5,1],[5,4],[11,1],[11,10]]);
  c14(5, [[6,1],[6,5],[10,1],[10,9]]);
  c14(6, [[7,1],[7,6],[9,1],[9,8]]);
  c14(7, [[8,1],[8,7]]);

  for(let c=2;c<=10;c++) m[13][c]=ex(m[14][c], m[14][c+1]);
  const c13=(c,t)=>t.forEach(([r,k])=>m[r][k]=m[13][c]);
  c13(2, [[4,2],[13,11]]);
  c13(3, [[12,2],[12,10],[5,2],[5,3]]);
  c13(4, [[11,2],[11,9],[6,4],[6,2]]);
  c13(5, [[10,2],[10,8],[7,5],[7,2]]);
  c13(6, [[9,2],[9,7],[8,6],[8,2]]);

  for(let j=3;j<=8;j++) m[12][j]=ex(m[13][j], m[13][j+1]);
  const c12=(c,t)=>t.forEach(([r,k])=>m[r][k]=m[12][c]);
  c12(3, [[12,9],[6,3]]);
  c12(4, [[11,3],[11,8],[7,4],[7,3]]);
  c12(5, [[10,3],[10,7],[8,5],[8,3]]);
  c12(6, [[9,3],[9,6]]);

  m[11][4]=ex(m[12][4], m[12][5]);
  m[11][5]=ex(m[12][5], m[12][6]);
  m[11][6]=ex(m[12][6], m[12][7]);

  const c11=(c,t)=>t.forEach(([r,k])=>m[r][k]=m[11][c]);
  c11(4, [[11,7],[8,4]]);
  c11(5, [[10,4],[10,6],[9,4],[9,5]]);

  m[10][5]=ex(m[11][5], m[11][6]);
  return m;
}

function codeFromAffirm(text){
  let arr=[];
  text = String(text||"").toUpperCase().replace(/[^A-ZÄÖÜß]/g,"");
  for(const c of text) if(affirmMap[c]) arr.push(affirmMap[c]);

  while(arr.length>8){
    const n=[];
    for(let i=0;i<arr.length-1;i++) n.push(ex(arr[i], arr[i+1]));
    arr=n;
  }
  while(arr.length<8) arr.push(0);
  return arr.slice(0,8);
}

function getColorMatrix(seed){
  const s = (seed===0 || !seed) ? 1 : seed;
  const shift = (s-1)%9;
  return baseColors.slice(shift).concat(baseColors.slice(0,shift));
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}

/* ====== QUADRAT engine / engines/quadrat/mandala.js ====== */

console.log("QUADRAT mandala.js LOADED v=1002");

var qMatrix = [];
var logoImg = null;
var isAdmin = false;

const PHI = 1.61803398875;

function isEmbed() {
  const p = new URLSearchParams(location.search);
  if (p.get("embed") === "1") return true;
  try { return window.self !== window.top; } catch (e) { return true; }
}
var EMBED = isEmbed();

var extState = {
  engine: "quadrat",
  mode: "geburtstag",
  input: "15011987",
  direction: "aussen",
  sliders: Array(10).fill(85),
  isAdmin: false
};

const mapZ = {
  1: "#FFD670", 2: "#DEAAFF", 3: "#FF686B",
  4: "#7A5BEC", 5: "#74FB92", 6: "#E9FF70",
  7: "#C0FDFF", 8: "#B2C9FF", 9: "#FFCBF2"
};

var colorMatrix = {
  1: {1:"#FF0000",2:"#0000FF",3:"#00FF00",4:"#FFFF00",5:"#00B0F0",6:"#00FFFF",7:"#FF66FF",8:"#FF9900",9:"#9900FF"},
  2: {1:"#0000FF",2:"#00FF00",3:"#FFFF00",4:"#00B0F0",5:"#00FFFF",6:"#FF66FF",7:"#FF9900",8:"#9900FF",9:"#FF0000"},
  3: {1:"#00FF00",2:"#FFFF00",3:"#00B0F0",4:"#00FFFF",5:"#FF66FF",6:"#FF9900",7:"#9900FF",8:"#FF0000",9:"#0000FF"},
  4: {1:"#FFFF00",2:"#00B0F0",3:"#00FFFF",4:"#FF66FF",5:"#FF9900",6:"#9900FF",7:"#FF0000",8:"#0000FF",9:"#00FF00"},
  5: {1:"#00B0F0",2:"#00FFFF",3:"#FF66FF",4:"#FF9900",5:"#9900FF",6:"#FF0000",7:"#0000FF",8:"#00FF00",9:"#FFFF00"},
  6: {1:"#00FFFF",2:"#FF66FF",3:"#FF9900",4:"#9900FF",5:"#FF0000",6:"#0000FF",7:"#00FF00",8:"#FFFF00",9:"#00B0F0"},
  7: {1:"#FF66FF",2:"#FF9900",3:"#9900FF",4:"#FF0000",5:"#0000FF",6:"#00FF00",7:"#FFFF00",8:"#00B0F0",9:"#00FFFF"},
  8: {1:"#FF9900",2:"#9900FF",3:"#FF0000",4:"#0000FF",5:"#00FF00",6:"#FFFF00",7:"#00B0F0",8:"#00FFFF",9:"#FF66FF"},
  9: {1:"#9900FF",2:"#FF0000",3:"#0000FF",4:"#00FF00",5:"#FFFF00",6:"#00B0F0",7:"#00FFFF",8:"#FF66FF",9:"#FF9900"}
};

function preload() {}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  pixelDensity(2);

  loadImage("../../assets/Logo_black.png",
    img => logoImg = img,
    () => loadImage("/milz_and_more/assets/Logo_black.png",
      img => logoImg = img
    )
  );

  if (EMBED) {
    noLoop();
    window.addEventListener("message", onMessageFromParent);
    try { window.parent.postMessage({ type: "READY" }, "*"); } catch (_) {}
    redraw();
  }
}

function waitForLogo(maxMs=5000){
  return new Promise(resolve=>{
    const start=Date.now();
    const tick=()=>{
      if(logoImg) return resolve(logoImg);
      if(Date.now()-start>maxMs) return resolve(null);
      setTimeout(tick,50);
    };
    tick();
  });
}

function draw() {
  background(12);

  const baseCode = getCodeFromDate(getInput());
  const startDigit = baseCode[0] || 1;

  push();
  const scaleFactor = (min(width, height) / 850) * 0.9;
  translate(width/2, height/2);
  scale(scaleFactor);

  calcQuadratMatrix(baseCode);
  drawQuadrat(startDigit, null, {stroke:true});
  pop();
}

/* ====== Nuller IMMER weiß + Linien überall ====== */
function drawQuadrat(startDigit, target, opts) {
  var ctx = target || window;
  var ts = 16;
  const strokeOn = opts && opts.stroke === true;

  ctx.rectMode(CORNER);

  if (strokeOn) {
    ctx.stroke(0,0,0,35);
    ctx.strokeWeight(1);
  } else {
    ctx.noStroke();
  }

  for (var r=0;r<20;r++){
    for (var c=0;c<20;c++){
      var val=qMatrix[r][c];

      if(val===0){
        ctx.fill(0,0,100,100); // Weiß
      }else{
        var hex=colorMatrix[startDigit][val]||mapZ[val];
        var col=color(hex);
        ctx.fill(hue(col),saturation(col),brightness(col),100);
      }

      ctx.rect(c*ts,-(r+1)*ts,ts,ts);
      ctx.rect(-(c+1)*ts,-(r+1)*ts,ts,ts);
      ctx.rect(c*ts,r*ts,ts,ts);
      ctx.rect(-(c+1)*ts,r*ts,ts,ts);
    }
  }
}

/* ====== Export identisch zu Wabe/Rund ====== */
async function exportHighRes(){
  const exportW=2480, exportH=3508;
  const pg=createGraphics(exportW,exportH);
  pg.colorMode(HSB,360,100,100);
  pg.background(255);

  const baseCode=getCodeFromDate(getInput());
  const startDigit=baseCode[0]||1;

  calcQuadratMatrix(baseCode);

  const ts=16;
  const gridSize=40*ts;
  const targetSizePx=exportW/PHI;
  const scale=targetSizePx/gridSize;

  const centerX=exportW/2;
  const centerY=exportH*(1/(PHI*PHI));

  pg.push();
  pg.translate(centerX,centerY);
  pg.scale(scale);
  drawQuadrat(startDigit,pg,{stroke:true});
  pg.pop();

  const exportLogo=await waitForLogo();

  if(exportLogo && !isAdmin){
    pg.resetMatrix();
    pg.tint(255,0.45);

    const wWidth=380;
    const wHeight=(exportLogo.height/exportLogo.width)*wWidth;

    const yShift=-200; // weiter oben

    for(let x=-100;x<exportW+400;x+=500){
      for(let y=-400;y<exportH+400;y+=500){
        pg.image(exportLogo,x,y+yShift,wWidth,wHeight);
      }
    }
    pg.noTint();
  }

  if(exportLogo){
    pg.resetMatrix();
    pg.noTint();
    const lW=500;
    const lH=(exportLogo.height/exportLogo.width)*lW;
    pg.image(exportLogo,exportW-lW-100,exportH-lH-100,lW,lH);
  }

  save(pg,'Milz&More_Quadrat.png');
}

/* --- Messaging (FIX) --- */
function onMessageFromParent(ev) {
  const msg = ev.data;
  if (!msg || typeof msg !== "object") return;

  if (msg.type === "SET_STATE" && msg.payload) {
    extState = Object.assign(extState, msg.payload);
    isAdmin = !!extState.isAdmin;
    redraw();
  }

  if (msg.type === "EXPORT") {
    if (msg.payload) {
      extState = Object.assign(extState, msg.payload);
      isAdmin = !!extState.isAdmin;
    }
    exportHighRes(); // async ok
  }
}

/* --- Helpers --- */
function getInput(){return EMBED?extState.input:"15011987";}
function getCodeFromDate(str){
  var val=String(str||"").replace(/[^0-9]/g,"");
  var res=val.split('').map(Number);
  while(res.length<8)res.push(0);
  return res.slice(0,8);
}

function ex(a,b){
  var s=(a||0)+(b||0);
  return(s===0)?0:(s%9===0?9:s%9);
}

function calcQuadratMatrix(code){
  qMatrix=Array(20).fill().map(()=>Array(20).fill(0));
  var d=[code[0],code[1]];
  function set2(r,c,v1,v2){
    if(r>=20||c>=20)return;
    qMatrix[r][c]=v1;
    if(c+1<20)qMatrix[r][c+1]=v2;
    if(r+1<20)qMatrix[r+1][c]=v2;
    if(r+1<20&&c+1<20)qMatrix[r+1][c+1]=v1;
  }
  for(var i=0;i<8;i+=2)set2(i,i,d[0],d[1]);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  if (EMBED) redraw();
}

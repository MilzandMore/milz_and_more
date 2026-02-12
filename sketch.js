var inputField, designSelect, logoImg;
const charMap = { 'A':1,'J':1,'S':1,'Ä':1,'B':2,'K':2,'T':2,'Ö':2,'C':3,'L':3,'U':3,'Ü':3,'D':4,'M':4,'V':4,'ß':4,'E':5,'N':5,'W':5,'F':6,'O':6,'X':6,'G':7,'P':7,'Y':7,'H':8,'Q':8,'Z':8,'I':9,'R':9 };
const colors = ["#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3"];

function preload() {
  logoImg = loadImage('Logo.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Einfachste Bedienelemente ohne Gruppen/Styling-Logik
  inputField = createInput('15011987');
  inputField.position(20, 20);
  
  designSelect = createSelect();
  designSelect.position(200, 20);
  designSelect.option('Quadrat');
  designSelect.option('Wabe');
  
  textAlign(CENTER, CENTER);
}

function draw() {
  background(255);
  let val = inputField.value();
  let code = val.replace(/\D/g, "").split('').map(Number);
  if (code.length < 1) return;

  translate(width/2, height/2);
  
  if (designSelect.value() === 'Quadrat') {
    drawQuad(code);
  } else {
    drawWabe(code);
  }

  // Logo anzeigen
  if (logoImg) {
    image(logoImg, -width/2 + 20, height/2 - 100, 100, 50);
  }
}

function drawQuad(code) {
  let sz = 20;
  for (let i = 0; i < code.length; i++) {
    fill(colors[(code[i]-1) % 9] || "#ccc");
    rect(i * sz - (code.length * sz)/2, 0, sz, sz);
  }
}

function drawWabe(code) {
  let sz = 20;
  for (let i = 0; i < code.length; i++) {
    fill(colors[(code[i]-1) % 9] || "#ccc");
    ellipse(i * sz - (code.length * sz)/2, 0, sz, sz);
  }
}

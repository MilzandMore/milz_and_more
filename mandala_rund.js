<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>
  <style>
    body { margin: 0; padding: 0; overflow: hidden; background: #ffffff; }
    canvas { display: block; }
  </style>
</head>
<body>
<script>
// 1. GLOBALE KONSTANTEN & VARIABLEN (DEIN ORIGINAL)
var baseColors = ["#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3"];

var affirmMap = { 
  A:1,J:1,S:1,Ä:1, B:2,K:2,T:2,Ö:2, C:3,L:3,U:3,Ü:3, D:4,M:4,V:4,ß:4, 
  E:5,N:5,W:5, F:6,O:6,X:6, G:7,P:7,Y:7, H:8,Q:8,Z:8, I:9,R:9 
};

var ex = (a,b) => (a + b) % 9 === 0 ? 9 : (a + b) % 9;

var modeSelect, inputField, sektS, richtungS, sliders = [], colorIndicators = [], sliderPanel;
var colorSeed = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  
  var isMobile = windowWidth < 600;

  // TOPBAR
  var topBar = createDiv("").style('position', 'fixed').style('top', '0').style('left', '0').style('width', '100%')
    .style('background', '#2c3e50').style('display', 'flex').style('padding', isMobile ? '4px 8px' : '10px 20px')
    .style('gap', isMobile ? '8px' : '20px').style('z-index', '200').style('align-items', 'center').style('height', isMobile ? '55px' : '75px');

  modeSelect = createSelect().parent(topBar);
  modeSelect.option('Geburtstag'); modeSelect.option('Affirmation');

  inputField = createInput("15011987").parent(topBar);

  sektS = createSelect().parent(topBar);
  ["6","8","10","12","13"].forEach(s => sektS.option(s)); sektS.selected("8");

  richtungS = createSelect().parent(topBar); 
  richtungS.option("Außen", "a"); richtungS.option("Innen", "b");

  sliderPanel = createDiv("").style('position', 'fixed').style('background', 'rgba(44, 62, 80, 0.98)').style('z-index', '150');
  for (var i = 1; i <= 9; i++) {
    var sRow = createDiv("").parent(sliderPanel).style('display','flex').style('align-items','center').style('gap','4px');
    colorIndicators[i] = createDiv("").parent(sRow).style('width', '8px').style('height', '8px').style('border-radius', '50%');
    sliders[i] = createSlider(20, 100, 85).parent(sRow).input(draw);
  }

  updateLayout();
  [modeSelect, inputField, sektS, richtungS].forEach(e => e.input(draw));
}

function updateLayout() {
  var isMobile = windowWidth < 600;
  if (isMobile) {
    sliderPanel.style('top', 'auto').style('bottom', '0').style('left', '0').style('width', '100%')
      .style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)').style('padding', '8px 4px');
    for (var i = 1; i <= 9; i++) if(sliders[i]) sliders[i].style('width', '75px');
  } else {
    sliderPanel.style('top', '90px').style('left', '0').style('display', 'flex').style('flex-direction', 'column').style('padding', '12px');
    for (var i = 1; i <= 9; i++) if(sliders[i]) sliders[i].style('width', '80px');
  }
}

function draw() {
  var isMobile = windowWidth < 600;
  var rawVal = inputField.value().trim();
  if (rawVal === "") return;

  background(255);
  
  // LOGIK BUILD SECTOR (DEIN ORIGINAL)
  var n = 16;
  var m = Array.from({length: n}, (_, r) => Array(r + 1).fill(0));
  var isAffirm = modeSelect.value() === 'Affirmation';
  var raw = isAffirm ? codeFromAffirm(rawVal) : rawVal.replace(/\D/g, "").split("").map(Number);
  while (raw.length < 8) raw.push(0);
  raw = raw.slice(0, 8);
  colorSeed = raw[0];
  
  var frame = (richtungS.value() === "b") ? [...raw].reverse() : [...raw];
  var base = [...frame].reverse().concat(frame);
  for (var i = 0; i < 16; i++) m[15][i] = base[i];
  for (var i = 0; i < 16; i++) { var r = 15 - i; m[r][0] = base[i]; m[r][r] = base[i]; }
  for (var c = 1; c <= 13; c++) m[14][c] = ex(m[15][c], m[15][c + 1]);
  var c14 = (c, t) => t.forEach(([r, k]) => m[r][k] = m[14][c]);
  c14(1, [[2, 1]]); c14(2, [[3, 1], [3, 2], [13, 1], [13, 12]]); c14(3, [[4, 1], [4, 3], [12, 1], [12, 11]]);
  c14(4, [[5, 1], [5, 4], [11, 1], [11, 10]]); c14(5, [[6, 1], [6, 5], [10, 1], [10, 9]]);
  c14(6, [[7, 1], [7, 6], [9, 1], [9, 8]]); c14(7, [[8, 1], [8, 7]]);
  for (var c = 2; c <= 10; c++) m[13][c] = ex(m[14][c], m[14][c + 1]);
  var c13 = (c, t) => t.forEach(([r, k]) => m[r][k] = m[13][c]);
  c13(2, [[4, 2], [13, 11]]); c13(3, [[12, 2], [12, 10], [5, 2], [5, 3]]);
  c13(4, [[11, 2], [11, 9], [6, 4], [6, 2]]); c13(5, [[10, 2], [10, 8], [7, 5], [7, 2]]);
  c13(6, [[9, 2], [9, 7], [8, 6], [8, 2]]);
  for (var j = 3; j <= 8; j++) m[12][j] = ex(m[13][j], m[13][j+1]);
  var c12 = (c, t) => t.forEach(([r, k]) => m[r][k] = m[12][c]);
  c12(3, [[12, 9], [6, 3]]); c12(4, [[11, 3], [11, 8], [7, 4], [7, 3]]);
  c12(5, [[10, 3], [10, 7], [8, 5], [8, 3]]); c12(6, [[9, 3], [9, 6]]);
  m[11][4] = ex(m[12][4], m[12][5]); m[11][5] = ex(m[12][5], m[12][6]); m[11][6] = ex(m[12][6], m[12][7]);
  var c11 = (c, t) => t.forEach(([r, k]) => m[r][k] = m[11][c]);
  c11(4, [[11, 7], [8, 4]]); c11(5, [[10, 4], [10, 6], [9, 4], [9, 5]]);
  m[10][5] = ex(m[11][5], m[11][6]);

  var currentColors = getColorMatrix(colorSeed);
  for (var i = 1; i <= 9; i++) { 
    if(colorIndicators[i]) colorIndicators[i].style('background-color', currentColors[i-1]); 
  }

  push();
  translate(width / 2, isMobile ? height / 2 - 40 : height / 2 + 20);
  scale((min(width, height) / 900) * (isMobile ? 0.85 : 0.95));
  
  var sc = int(sektS.value());
  var angle = TWO_PI / sc;
  for (var i = 0; i < sc; i++) {
    push(); 
    rotate(i * angle); 
    // DRAW SECTOR LOGIK (DEIN ORIGINAL)
    var step = 20;
    var h = tan(angle / 2) * step;
    stroke(0, 35); strokeWeight(0.5);
    for (var r = 0; r < m.length; r++) {
      for (var c = 0; c <= r; c++) {
        var v = m[r][c];
        var x = r * step; var y = (c - r / 2) * h * 2;
        if (v >= 1 && v <= 9) {
          var baseCol = color(currentColors[v - 1]);
          var sVal = sliders[v].value();
          fill(hue(baseCol), map(sVal, 20, 100, 15, saturation(baseCol)), map(sVal, 20, 100, 98, brightness(baseCol)));
        } else fill(255); 
        beginShape(); vertex(x, y); vertex(x + step, y - h); vertex(x + step * 2, y); vertex(x + step, y + h); endShape(CLOSE);
      }
    }
    pop();
  }
  pop();
}

function codeFromAffirm(text) {
  var arr = []; text = text.toUpperCase().replace(/[^A-ZÄÖÜß]/g, "");
  for (var c of text) if (affirmMap[c]) arr.push(affirmMap[c]);
  while (arr.length > 8) {
    var n = []; for (var i = 0; i < arr.length - 1; i++) n.push(ex(arr[i], arr[i + 1]));
    arr = n;
  }
  while (arr.length < 8) arr.push(0);
  return arr.slice(0, 8);
}

function getColorMatrix(seed) {
  var s = (seed === 0 || !seed) ? 1 : seed;
  var shift = (s - 1) % 9;
  return baseColors.slice(shift).concat(baseColors.slice(0, shift));
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); updateLayout(); }
</script>
</body>
</html>

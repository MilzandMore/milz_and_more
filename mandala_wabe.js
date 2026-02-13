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
// HIER DEIN ORIGINAL-CODE
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

var inputD, dirS, modeS, sliders = [], colorIndicators = [], sliderPanel, topBar;

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100);
    var isMobile = windowWidth < 600;

    topBar = createDiv("").style('position', 'fixed').style('top', '0').style('left', '0').style('width', '100%')
        .style('background', '#2c3e50').style('display', 'flex').style('padding', isMobile ? '4px 8px' : '10px 20px')
        .style('gap', isMobile ? '8px' : '20px').style('z-index', '200').style('height', isMobile ? '55px' : '75px').style('align-items', 'center');

    modeS = createSelect().parent(topBar); 
    modeS.option('Geburtstag'); modeS.option('Affirmation');

    inputD = createInput('15011987').parent(topBar);

    dirS = createSelect().parent(topBar);
    dirS.option('Außen', 'nach außen'); dirS.option('Innen', 'nach innen');

    sliderPanel = createDiv("").style('position', 'fixed').style('background', 'rgba(44, 62, 80, 0.98)').style('z-index', '150');
    for (var i = 1; i <= 9; i++) {
        var sRow = createDiv("").parent(sliderPanel).style('display','flex').style('align-items','center');
        colorIndicators[i] = createDiv("").parent(sRow).style('width', '8px').style('height', '8px').style('border-radius', '50%');
        sliders[i] = createSlider(20, 100, 85).parent(sRow).input(draw);
    }

    updateLayout();
    [inputD, dirS, modeS].forEach(e => e.input(draw));
}

function updateLayout() {
    var isMobile = windowWidth < 600;
    if (isMobile) {
        sliderPanel.style('bottom', '0').style('left', '0').style('top', 'auto').style('width', '100%').style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)');
        for (var i = 1; i <= 9; i++) sliders[i].style('width', '75px');
    } else {
        sliderPanel.style('top', '90px').style('left', '0').style('display', 'flex').style('flex-direction', 'column');
        for (var i = 1; i <= 9; i++) sliders[i].style('width', '80px');
    }
}

function draw() {
    var isMobile = windowWidth < 600;
    background(255);
    var rawVal = inputD.value().trim();
    if (rawVal === "") return;

    var code = (modeS.value() === 'Affirmation') ? getCodeFromText(rawVal) : rawVal.replace(/\D/g, "").split('').map(Number);
    while (code.length < 8) code.push(0);
    code = code.slice(0, 8);
    var cKey = code[0] || 1;

    for (var i = 1; i <= 9; i++) colorIndicators[i].style('background-color', colorMatrix[cKey][i - 1]);

    push();
    translate(width / 2, height / 2 + (isMobile ? -40 : 20));
    scale((min(width, height) / 520) * (isMobile ? 0.45 : 0.48));
    
    // HIER DEINE ORIGINAL-MATHEMATIK
    var sz = 16.2;
    stroke(0, 35);
    var path = (dirS.value().includes('innen')) ? [...code, ...[...code].reverse()] : [...[...code].reverse(), ...code];
    for (var s = 0; s < 6; s++) {
        push(); rotate(s * PI / 3);
        var m = Array(17).fill().map(() => Array(17).fill(0));
        for (var i = 0; i < 16; i++) m[16][i] = path[i % path.length];
        for (var r = 15; r >= 1; r--) for (var i = 0; i < r; i++) m[r][i] = ex(m[r+1][i], m[r+1][i+1]);
        for (var r = 1; r <= 16; r++) {
            for (var i = 0; i < r; i++) {
                var val = m[r][i];
                if (val >= 1 && val <= 9) {
                    var col = color(colorMatrix[cKey][val - 1]);
                    fill(hue(col), map(sliders[val].value(), 20, 100, 15, saturation(col)), map(sliders[val].value(), 20, 100, 98, brightness(col)));
                } else fill(255);
                var x = (i - (r - 1) / 2) * sz * sqrt(3), y = -(r - 1) * sz * 1.5;
                beginShape(); for (var a = PI / 6; a < TWO_PI; a += PI / 3) vertex(x + cos(a) * sz, y + sin(a) * sz); endShape(CLOSE);
            }
        }
        pop();
    }
    pop();
}

function getCodeFromText(textStr) {
    var cleanText = textStr.toUpperCase().replace(/[^A-ZÄÖÜß]/g, "");
    var currentRow = cleanText.split("").map(c => charMap[c]).filter(n => n);
    while(currentRow.length < 8) currentRow.push(9);
    while (currentRow.length > 8) {
        var nextRow = [];
        for (var i = 0; i < currentRow.length - 1; i++) nextRow.push(ex(currentRow[i], currentRow[i+1]));
        currentRow = nextRow;
    }
    return currentRow;
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); updateLayout(); }
</script>
</body>
</html>

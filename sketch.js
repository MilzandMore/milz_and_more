// 1. GLOBALE VARIABLEN
var designSelect, modeSelect, inputField, sektS, dirSelect, codeDisplay;
var sliders = [], sliderPanel, sektGroup;
var logoImg = null;
var qMatrix = [];

const colorMatrix = {
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

const charMap = { 'A':1,'J':1,'S':1,'Ä':1,'B':2,'K':2,'T':2,'Ö':2,'C':3,'L':3,'U':3,'Ü':3,'D':4,'M':4,'V':4,'ß':4,'E':5,'N':5,'W':5,'F':6,'O':6,'X':6,'G':7,'P':7,'Y':7,'H':8,'Q':8,'Z':8,'I':9,'R':9 };
var ex = (a, b) => (a + b === 0) ? 0 : ((a + b) % 9 === 0 ? 9 : (a + b) % 9);

function preload() {
    // Falls das Logo fehlt, wird der Fehler ignoriert und das Programm startet trotzdem
    logoImg = loadImage('Logo.png', img => console.log("Logo geladen"), err => console.log("Logo fehlt"));
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100);
    var isMobile = windowWidth < 600;

    var topBar = createDiv("").style('position', 'fixed').style('top', '0').style('left', '0').style('width', '100%').style('background', '#2c3e50').style('display', 'flex').style('padding', isMobile ? '4px 8px' : '10px 20px').style('gap', isMobile ? '8px' : '20px').style('z-index', '200').style('align-items', 'center').style('height', isMobile ? '55px' : '75px').style('box-sizing', 'border-box');

    function createUIGroup(labelTxt, element, wMobile, wDesktop) {
        var group = createDiv("").parent(topBar).style('display', 'flex').style('flex-direction', 'column');
        createSpan(labelTxt).parent(group).style('font-size', '8px').style('color', '#bdc3c7').style('font-weight', 'bold');
        if (element) {
            element.parent(group).style('width', isMobile ? wMobile : wDesktop).style('background', '#34495e').style('color', '#fff').style('border', 'none').style('border-radius', '4px').style('font-size', isMobile ? '11px' : '13px').style('height', isMobile ? '22px' : '32px');
        }
        return group;
    }

    designSelect = createSelect(); ["Quadrat", "Rund", "Wabe"].forEach(d => designSelect.option(d));
    createUIGroup("DESIGN", designSelect, "75px", "100px");

    modeSelect = createSelect(); modeSelect.option('Geburtstag'); modeSelect.option('Affirmation');
    createUIGroup("MODUS", modeSelect, "80px", "110px");

    inputField = createInput('15011987');
    createUIGroup("EINGABE", inputField, "75px", "130px");

    var codeGroup = createUIGroup("CODE", null, "auto", "auto");
    codeDisplay = createSpan("").parent(codeGroup).style('color', '#fff').style('font-weight', 'bold');

    sektS = createSelect(); ["6","8","10","12","13"].forEach(s => sektS.option(s)); sektS.selected("8");
    sektGroup = createUIGroup("SEKTOR", sektS, "40px", "60px");

    dirSelect = createSelect(); dirSelect.option('Außen'); dirSelect.option('Innen');
    createUIGroup("RICHTUNG", dirSelect, "65px", "95px");

    // Weißer Button, schwarze Schrift
    var saveBtn = createButton('Download').parent(topBar).style('margin-left', 'auto').style('background', '#ffffff').style('color', '#000000').style('border', 'none').style('padding', '8px 12px').style('border-radius', '4px').style('font-weight', 'bold');
    saveBtn.mousePressed(exportHighRes);

    sliderPanel = createDiv("").style('position', 'fixed').style('background', 'rgba(44, 62, 80, 0.95)').style('z-index', '150').style('padding', '8px');
    for (var i = 1; i <= 9; i++) {
        var sRow = createDiv("").parent(sliderPanel).style('display','flex').style('align-items','center').style('gap','5px');
        createDiv("").parent(sRow).style('width', '10px').style('height', '10px').style('border-radius', '50%');
        sliders[i] = createSlider(20, 100, 85).parent(sRow).input(() => redraw());
    }

    updateLayout();
    [designSelect, modeSelect, dirSelect, inputField, sektS].forEach(e => e.changed(redraw));
}

function updateLayout() {
    if (!sliderPanel) return;
    var isMobile = windowWidth < 600;
    if (isMobile) {
        sliderPanel.style('top', 'auto').style('bottom', '0').style('left', '0').style('width', '100%').style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)');
    } else {
        sliderPanel.style('bottom', 'auto').style('top', '90px').style('left', '0').style('width', 'auto').style('display', 'flex').style('flex-direction', 'column');
    }
    for (var i = 1; i <= 9; i++) {
        if (sliders[i]) sliders[i].style('width', isMobile ? '75px' : '80px');
    }
}

function draw() {
    background(255);
    if (!designSelect || !inputField) return;

    var isMobile = windowWidth < 600;
    var design = designSelect.value();
    if (design === "Rund") sektGroup.show(); else sektGroup.hide();
    
    var rawVal = inputField.value();
    var baseCode = (modeSelect.value() === 'Affirmation') ? getCodeFromText(rawVal) : rawVal.replace(/\D/g, "").split('').map(Number);
    while (baseCode.length < 8) baseCode.push(0);
    baseCode = baseCode.slice(0, 8);
    var startDigit = baseCode[0] || 1;
    var drawCode = (dirSelect.value() === 'Innen') ? [...baseCode].reverse() : baseCode;
    
    codeDisplay.html(baseCode.join(""));

    push();
    translate(width / 2, height / 2 + (isMobile ? -20 : 40));
    
    if (design === "Quadrat") {
        scale((min(width, height) / 850) * (isMobile ? 0.75 : 0.9));
        calcQuadratMatrix(drawCode);
        renderQuadrat(startDigit);
    } else if (design === "Rund") {
        scale((min(width, height) / 900) * (isMobile ? 0.8 : 0.95));
        renderRund(drawCode, startDigit);
    } else if (design === "Wabe") {
        scale((min(width, height) / 520) * (isMobile ? 0.42 : 0.48));
        renderWabe(drawCode, startDigit);
    }
    pop();

    if (logoImg && logoImg.width > 1) {
        var lW = isMobile ? 55 : 150;
        var lH = (logoImg.height / logoImg.width) * lW;
        image(logoImg, 15, isMobile ? height - 125 : height - lH - 25, lW, lH);
    }
}

function exportHighRes() {
    var pg = createGraphics(3508, 4961);
    pg.colorMode(HSB, 360, 100, 100);
    pg.background(255);
    
    var design = designSelect.value();
    var rawVal = inputField.value();
    var baseCode = (modeSelect.value() === 'Affirmation') ? getCodeFromText(rawVal) : rawVal.replace(/\D/g, "").split('').map(Number);
    while (baseCode.length < 8) baseCode.push(0);
    var startDigit = baseCode[0] || 1;
    var drawCode = (dirSelect.value() === 'Innen') ? [...baseCode].reverse() : baseCode;

    pg.push();
    pg.translate(pg.width / 2, pg.height * 0.45);
    if (design === "Quadrat") { pg.scale(5.5); calcQuadratMatrix(drawCode); renderQuadrat(startDigit, pg); }
    else if (design === "Rund") { pg.scale(4.8); renderRund(drawCode, startDigit, pg); }
    else if (design === "Wabe") { pg.scale(3.5); renderWabe(drawCode, startDigit, pg); }
    pg.pop();

    if (logoImg && logoImg.width > 1) {
        var lW = 600;
        var lH = (logoImg.height / logoImg.width) * lW;
        pg.image(logoImg, pg.width - lW - 150, pg.height - lH - 250, lW, lH);
    }
    
    pg.fill(0); pg.noStroke(); pg.textAlign(RIGHT); pg.textSize(80);
    pg.text("Milz & More", pg.width - 150, pg.height - 150);
    save(pg, 'MilzMore_' + rawVal + '_' + design + '.png');
}

function getFinalCol(val, startDigit) {
    var hex = colorMatrix[startDigit][val - 1];
    var col = color(hex);
    var sVal = sliders[val] ? sliders[val].value() : 85;
    return color(hue(col), map(sVal, 20, 100, 15, saturation(col)), map(sVal, 20, 100, 98, brightness(col)));
}

function renderQuadrat(startDigit, target) {
    var ctx = target || window;
    var ts = 16; ctx.stroke(0, 35); ctx.strokeWeight(0.5);
    for (var r = 0; r < 20; r++) {
        for (var c = 0; c < 20; c++) {
            var val = qMatrix[r][c];
            if (val > 0) {
                ctx.fill(getFinalCol(val, startDigit));
                ctx.rect(c * ts, -(r + 1) * ts, ts, ts); ctx.rect(-(c + 1) * ts, -(r + 1) * ts, ts, ts); 
                ctx.rect(c * ts, r * ts, ts, ts); ctx.rect(-(c + 1) * ts, r * ts, ts, ts);        
            }
        }
    }
}

function renderRund(code, startDigit, target) {
    var ctx = target || window;
    var m = buildMandalaMatrix(code);
    var sc = int(sektS.value());
    var step = 20; var angle = TWO_PI / sc; var h = tan(angle / 2) * step;
    ctx.stroke(0, 35); ctx.strokeWeight(0.5);
    for (var i = 0; i < sc; i++) {
        ctx.push(); ctx.rotate(i * angle);
        for (var r = 0; r < 16; r++) {
            for (var c = 0; c <= r; c++) {
                var v = m[r][c];
                if (v > 0) ctx.fill(getFinalCol(v, startDigit)); else ctx.fill(255);
                var x = r * step, y = (c - r / 2) * h * 2;
                ctx.beginShape(); ctx.vertex(x, y); ctx.vertex(x + step, y - h); ctx.vertex(x + step * 2, y); ctx.vertex(x + step, y + h); ctx.endShape(CLOSE);
            }
        }
        ctx.pop();
    }
}

function renderWabe(code, startDigit, target) {
    var ctx = target || window;
    var sz = 16.2; ctx.stroke(0, 35); ctx.strokeWeight(0.5);
    var path = (dirSelect.value() === 'Innen') ? [...code, ...[...code].reverse()] : [...[...code].reverse(), ...code];
    for (var s = 0; s < 6; s++) {
        ctx.push(); ctx.rotate(s * PI / 3);
        var m = Array(17).fill().map(() => Array(17).fill(0));
        for (var i = 0; i < 16; i++) m[16][i] = path[i % path.length];
        for (var r = 15; r >= 1; r--) for (var i = 0; i < r; i++) m[r][i] = ex(m[r+1][i], m[r+1][i+1]);
        for (var r = 1; r <= 16; r++) {
            for (var i = 0; i < r; i++) {
                var v = m[r][i];
                if (v > 0) ctx.fill(getFinalCol(v, startDigit)); else ctx.fill(255);
                var x = (i - (r - 1) / 2) * sz * sqrt(3), y = -(r - 1) * sz * 1.5;
                ctx.beginShape(); for (var a = PI/6; a < TWO_PI; a += PI/3) ctx.vertex(x + cos(a) * sz, y + sin(a) * sz); ctx.endShape(CLOSE);
            }
        }
        ctx.pop();
    }
}

function calcQuadratMatrix(code) {
    qMatrix = Array(20).fill().map(() => Array(20).fill(0));
    var set2 = (r, c, v1, v2) => { if (r < 20 && c < 20) { qMatrix[r][c] = v1; if(c+1<20) qMatrix[r][c+1]=v2; if(r+1<20) qMatrix[r+1][c]=v2; if(r+1<20 && c+1<20) qMatrix[r+1][c+1]=v1; } };
    for(var i=0; i<8; i+=2) set2(i, i, code[0], code[1]);
    for(var i=0; i<6; i+=2) { set2(i, i+2, code[2], code[3]); set2(i+2, i, code[2], code[3]); }
    for(var i=0; i<4; i+=2) { set2(i, i+4, code[4], code[5]); set2(i+4, i, code[4], code[5]); }
    set2(0, 6, code[6], code[7]); set2(6, 0, code[6], code[7]);
    for(var r=0; r<8; r++) for(var c=8; c<20; c++) qMatrix[r][c] = ex(qMatrix[r][c-2], qMatrix[r][c-1]);
    for(var c=0; c<20; c++) for(var r=8; r<20; r++) qMatrix[r][c] = ex(qMatrix[r-2][c], qMatrix[r-1][c]);
}

function buildMandalaMatrix(raw) {
    var n = 16; var m = Array.from({length: n}, (_, r) => Array(r + 1).fill(0));
    var base = [...raw].reverse().concat(raw);
    for (var i = 0; i < 16; i++) { m[15][i] = base[i]; m[15 - i][0] = base[i]; m[15 - i][15 - i] = base[i]; }
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
    return m;
}

function getCodeFromText(t) {
    var a = t.toUpperCase().replace(/[^A-ZÄÖÜß]/g, "").split("").map(c => charMap[c] || 9);
    if (a.length === 0) return [1,1,1,1,1,1,1,1];
    while (a.length < 8) a.push(9);
    while (a.length > 8) { var n = []; for (var i=0; i<a.length-1; i++) n.push(ex(a[i], a[i+1])); a = n; }
    return a;
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); updateLayout(); redraw(); }

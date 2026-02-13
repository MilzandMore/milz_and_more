// 1. GLOBALE KONSTANTEN & VARIABLEN
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

var inputD, dirS, modeS, codeDisplay, sliders = [], colorIndicators = [], sliderPanel, topBar;
var logoImg;
var isAdmin = false;

function preload() {
    logoImg = loadImage('logo.png');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100);
    smooth(8);
    
    var params = getURLParams();
    if (params.access === 'milz_secret') isAdmin = true;

    var isMobile = windowWidth < 600;

    topBar = createDiv("").style('position', 'fixed').style('top', '0').style('left', '0').style('width', '100%')
        .style('background', '#2c3e50').style('color', '#fff').style('display', 'flex').style('padding', isMobile ? '4px 8px' : '10px 20px')
        .style('gap', isMobile ? '8px' : '20px').style('font-family', '"Inter", sans-serif').style('z-index', '200')
        .style('align-items', 'center').style('box-sizing', 'border-box').style('height', isMobile ? '55px' : '75px');

    function createUIGroup(labelTxt, element, wMobile, wDesktop) {
        var group = createDiv("").parent(topBar).style('display', 'flex').style('flex-direction', 'column').style('justify-content', 'center');
        createSpan(labelTxt).parent(group).style('font-size', isMobile ? '8px' : '10px').style('color', '#bdc3c7').style('text-transform', 'uppercase').style('font-weight', 'bold').style('margin-bottom', '2px');
        if (element) {
            element.parent(group).style('width', isMobile ? wMobile : wDesktop)
                .style('font-size', isMobile ? '11px' : '13px').style('background', '#34495e').style('color', '#fff')
                .style('border', 'none').style('border-radius', '4px').style('padding', isMobile ? '3px 5px' : '6px 8px')
                .style('height', isMobile ? '22px' : '32px');
        }
        return group;
    }

    modeS = createSelect(); 
    modeS.option('Geburtstag'); modeS.option('Affirmation');
    createUIGroup("MODUS", modeS, "80px", "110px");

    inputD = createInput('15011987');
    createUIGroup("EINGABE", inputD, "75px", "140px");

    var codeGroup = createUIGroup("CODE", null, "auto", "auto");
    codeDisplay = createSpan("").parent(codeGroup).style('font-size', isMobile ? '11px' : '14px').style('color', '#fff').style('font-weight', '600').style('letter-spacing', '1px');

    dirS = createSelect(); 
    dirS.option('Außen', 'nach außen'); dirS.option('Innen', 'nach innen');
    createUIGroup("RICHTUNG", dirS, "65px", "100px");

    var saveBtn = createButton('DOWNLOAD').parent(topBar)
        .style('margin-left', 'auto').style('background', '#ffffff').style('color', '#2c3e50')
        .style('border', 'none').style('font-weight', 'bold').style('border-radius', '4px')
        .style('padding', isMobile ? '6px 8px' : '10px 16px').style('font-size', isMobile ? '9px' : '12px').style('cursor', 'pointer');
    saveBtn.mousePressed(exportHighRes);

    sliderPanel = createDiv("").style('position', 'fixed').style('background', 'rgba(44, 62, 80, 0.98)').style('z-index', '150');
    for (var i = 1; i <= 9; i++) {
        var sRow = createDiv("").parent(sliderPanel).style('display','flex').style('align-items','center').style('gap','4px');
        colorIndicators[i] = createDiv("").parent(sRow).style('width', '8px').style('height', '8px').style('border-radius', '50%');
        sliders[i] = createSlider(20, 100, 85).parent(sRow).input(() => redraw());
    }

    updateLayout();
    [inputD, dirS, modeS].forEach(e => e.input ? e.input(redraw) : e.changed(redraw));
}

function updateLayout() {
    var isMobile = windowWidth < 600;
    if (isMobile) {
        sliderPanel.style('top', 'auto').style('bottom', '0').style('left', '0').style('width', '100%')
            .style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)').style('padding', '8px 4px').style('gap', '4px');
        for (var i = 1; i <= 9; i++) if(sliders[i]) sliders[i].style('width', '75px'); // [cite: 2026-02-11]
    } else {
        sliderPanel.style('bottom', 'auto').style('top', '90px').style('left', '0').style('width', 'auto')
            .style('display', 'flex').style('flex-direction', 'column').style('padding', '12px').style('border-radius', '0 8px 8px 0');
        for (var i = 1; i <= 9; i++) if(sliders[i]) sliders[i].style('width', '80px');
    }
}

function draw() {
    var isMobile = windowWidth < 600;
    var rawVal = inputD.value().trim();
    var isInvalid = (rawVal === "" || (modeS.value() === 'Geburtstag' && rawVal.replace(/\D/g, "").length === 0));
    if (isInvalid) return; 

    background(255);
    var code = (modeS.value() === 'Affirmation') ? getCodeFromText(rawVal) : rawVal.replace(/\D/g, "").split('').map(Number);
    while (code.length < 8) code.push(0);
    code = code.slice(0, 8);
    
    if (code.every(v => v === 0)) return;
    if(codeDisplay) codeDisplay.html(code.join(""));
    
    var cKey = code[0] || 1;
    for (var i = 1; i <= 9; i++) {
        colorIndicators[i].style('background-color', colorMatrix[cKey][i - 1]);
    }

    push();
    var yOffset = isMobile ? -40 : 20; 
    var centerX = width / 2;
    translate(centerX, height / 2 + yOffset);
    
    var scaleFactor = (min(width, height) / 520) * (isMobile ? 0.45 : 0.48); 
    scale(scaleFactor);
    renderWabeKorrekt(code, cKey);
    pop();

    if (logoImg && logoImg.width > 0) {
        push(); resetMatrix();
        var lW = isMobile ? 55 : 150;
        var lH = (logoImg.height / logoImg.width) * lW;
        var logoY = isMobile ? height - 125 : height - lH - 25;
        image(logoImg, 15, logoY, lW, lH); 
        pop();
    }
}

function renderWabeKorrekt(code, cKey, target) {
    var ctx = target || window; 
    var sz = 16.2;
    ctx.stroke(0, 35);
    var path = (dirS.value().includes('innen')) ? [...code, ...[...code].reverse()] : [...[...code].reverse(), ...code];
    for (var s = 0; s < 6; s++) {
        ctx.push(); ctx.rotate(s * PI / 3);
        var m = Array(17).fill().map(() => Array(17).fill(0));
        for (var i = 0; i < 16; i++) m[16][i] = path[i % path.length];
        for (var r = 15; r >= 1; r--) for (var i = 0; i < r; i++) m[r][i] = ex(m[r+1][i], m[r+1][i+1]);
        for (var r = 1; r <= 16; r++) {
            for (var i = 0; i < r; i++) {
                var val = m[r][i];
                if (val >= 1 && val <= 9) {
                    var col = color(colorMatrix[cKey][val - 1]);
                    ctx.fill(hue(col), map(sliders[val].value(), 20, 100, 15, saturation(col)), map(sliders[val].value(), 20, 100, 98, brightness(col)));
                } else ctx.fill(255);
                var x = (i - (r - 1) / 2) * sz * sqrt(3), y = -(r - 1) * sz * 1.5;
                ctx.beginShape(); for (var a = PI / 6; a < TWO_PI; a += PI / 3) ctx.vertex(x + cos(a) * sz, y + sin(a) * sz); ctx.endShape(CLOSE);
            }
        }
        ctx.pop();
    }
}

function exportHighRes() {
    var exportW = 2480; var exportH = 3508; 
    var pg = createGraphics(exportW, exportH);
    pg.colorMode(HSB, 360, 100, 100); pg.background(255);
    var rawVal = inputD.value().trim();
    var code = (modeS.value() === 'Affirmation') ? getCodeFromText(rawVal) : rawVal.replace(/\D/g, "").split('').map(Number);
    while (code.length < 8) code.push(0);
    code = code.slice(0, 8);
    var cKey = code[0] || 1;

    pg.push();
    pg.translate(exportW / 2, exportH * 0.40); 
    pg.scale(2.4);
    renderWabeKorrekt(code, cKey, pg);
    pg.pop();

    if (logoImg && !isAdmin) {
        pg.resetMatrix(); pg.tint(255, 0.45);
        var wWidth = 380; var wHeight = (logoImg.height / logoImg.width) * wWidth;
        for (var x = -100; x < exportW + 400; x += 500) { 
            for (var y = -100; y < exportH + 400; y += 500) pg.image(logoImg, x, y, wWidth, wHeight); 
        }
        pg.noTint();
    }

    if (logoImg) {
        var lW = 500; var lH = (logoImg.height / logoImg.width) * lW;
        pg.image(logoImg, exportW - lW - 100, exportH - lH - 100, lW, lH);
    }
    save(pg, 'Milz&More_Wabe.png');
}

function getCodeFromText(textStr) {
    var cleanText = textStr.toUpperCase().replace(/[^A-ZÄÖÜß]/g, "");
    if (cleanText.length === 0) return [0,0,0,0,0,0,0,0];
    var currentRow = cleanText.split("").map(c => charMap[c]).filter(n => n);
    while(currentRow.length < 8) currentRow.push(9);
    while (currentRow.length > 8) {
        var nextRow = [];
        for (var i = 0; i < currentRow.length - 1; i++) nextRow.push(ex(currentRow[i], currentRow[i+1]));
        currentRow = nextRow;
    }
    return currentRow;
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); updateLayout(); redraw(); }

// --- GLOBALE VARIABLEN ---
var inputField, modeSelect, designSelect, dirSelect, sektS, sliders = [], colorIndicators = [], sliderPanel;
var logoImg, codeDisplay, sektGroup;

const charMap = { 'A':1,'J':1,'S':1,'Ä':1,'B':2,'K':2,'T':2,'Ö':2,'C':3,'L':3,'U':3,'Ü':3,'D':4,'M':4,'V':4,'ß':4,'E':5,'N':5,'W':5,'F':6,'O':6,'X':6,'G':7,'P':7,'Y':7,'H':8,'Q':8,'Z':8,'I':9,'R':9 };
const baseColorsRund = ["#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3"];
const colorMatrixWabe = {
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

const ex = (a, b) => (a + b === 0) ? 0 : ((a + b) % 9 === 0 ? 9 : (a + b) % 9);

function preload() { 
    logoImg = loadImage('Logo.png'); 
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100);
    var isMobile = windowWidth < 600;

    var topBar = createDiv("").style('position', 'fixed').style('top', '0').style('left', '0').style('width', '100%')
        .style('background', '#2c3e50').style('color', '#fff').style('display', 'flex').style('padding', isMobile ? '4px 8px' : '10px 20px')
        .style('gap', isMobile ? '8px' : '20px').style('font-family', 'sans-serif').style('z-index', '200')
        .style('align-items', 'center').style('box-sizing', 'border-box').style('height', isMobile ? '55px' : '75px');

    function createUIGroup(labelTxt, element, wMobile, wDesktop) {
        var group = createDiv("").parent(topBar).style('display', 'flex').style('flex-direction', 'column');
        createSpan(labelTxt).parent(group).style('font-size', isMobile ? '8px' : '10px').style('color', '#bdc3c7').style('text-transform', 'uppercase').style('font-weight', 'bold');
        if (element) {
            element.parent(group).style('width', isMobile ? wMobile : wDesktop)
                .style('font-size', isMobile ? '11px' : '13px').style('background', '#34495e').style('color', '#fff')
                .style('border', 'none').style('border-radius', '4px').style('padding', isMobile ? '3px' : '6px').style('height', isMobile ? '22px' : '32px');
        }
        return group;
    }

    designSelect = createSelect(); designSelect.option('Quadrat'); designSelect.option('Rund'); designSelect.option('Wabe');
    createUIGroup("DESIGN", designSelect, "70px", "100px");

    modeSelect = createSelect(); modeSelect.option('Geburtstag'); modeSelect.option('Affirmation');
    createUIGroup("MODUS", modeSelect, "80px", "110px");

    inputField = createInput('15011987');
    createUIGroup("EINGABE", inputField, "75px", "130px");

    var codeGroup = createUIGroup("CODE", null, "auto", "auto");
    codeDisplay = createSpan("").parent(codeGroup).style('font-size', isMobile ? '11px' : '14px').style('color', '#fff').style('font-weight', '600');

    dirSelect = createSelect(); dirSelect.option('Außen', 'a'); dirSelect.option('Innen', 'b');
    createUIGroup("RICHTUNG", dirSelect, "60px", "90px");

    sektS = createSelect(); ["6","8","10","12","13"].forEach(s => sektS.option(s)); sektS.selected("8");
    sektGroup = createUIGroup("SEKTOR", sektS, "40px", "60px");

    var saveBtn = createButton('DOWNLOAD').parent(topBar)
        .style('margin-left', 'auto').style('background', '#fff').style('color', '#2c3e50').style('border', 'none').style('font-weight', 'bold')
        .style('border-radius', '4px').style('padding', isMobile ? '6px 8px' : '10px 16px').style('cursor', 'pointer');
    saveBtn.mousePressed(() => saveCanvas('Milz_More_Design', 'png'));

    sliderPanel = createDiv("").style('position', 'fixed').style('background', 'rgba(44, 62, 80, 0.98)').style('z-index', '150');
    for (var i = 1; i <= 9; i++) {
        var sRow = createDiv("").parent(sliderPanel).style('display', 'flex').style('align-items', 'center').style('gap', '4px');
        colorIndicators[i] = createDiv("").parent(sRow).style('width', '10px').style('height', '10px').style('border-radius', '50%');
        sliders[i] = createSlider(20, 100, 85).parent(sRow).input(() => redraw());
        if (isMobile) sliders[i].style('width', '75px');
    }

    updateLayout();
    [designSelect, modeSelect, dirSelect, inputField, sektS].forEach(e => e.changed(redraw));
}

function updateLayout() {
    var isMobile = windowWidth < 600;
    if (isMobile) {
        sliderPanel.style('top', 'auto').style('bottom', '0').style('left', '0').style('width', '100%').style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)').style('padding', '8px 4px');
    } else {
        sliderPanel.style('bottom', 'auto').style('top', '90px').style('left', '0').style('width', 'auto').style('display', 'flex').style('flex-direction', 'column').style('padding', '12px').style('border-radius', '0 8px 8px 0');
    }
}

function draw() {
    background(255);
    var isMobile = windowWidth < 600;
    var design = designSelect.value();
    var raw = inputField.value().trim();
    if (raw === "") return;

    var code = (modeSelect.value() === 'Geburtstag') ? raw.replace(/\D/g, "").split('').map(Number) : getCodeFromText(raw);
    while (code.length < 8) code.push(0); code = code.slice(0, 8);
    codeDisplay.html(code.join(""));

    var startDigit = code[0] || 1;
    updateIndicators(startDigit, design);
    
    // VERBESSERTE LOGIK FÜR SEKTOR-ANZEIGE
    if(sektGroup) {
        if (design === 'Rund') sektGroup.show(); else sektGroup.hide();
    }

    push();
    translate(width/2, isMobile ? height / 2 - 40 : height / 2 + 20);

    if (design === 'Quadrat') {
        scale((min(width, height) / 850) * (isMobile ? 0.8 : 0.95));
        renderQuadrat(code, startDigit);
    } else if (design === 'Rund') {
        scale((min(width, height) / 900) * (isMobile ? 0.85 : 0.95));
        renderRund(code, startDigit);
    } else if (design === 'Wabe') {
        scale((min(width, height) / 520) * (isMobile ? 0.45 : 0.48));
        renderWabe(code, startDigit);
    }
    pop();

    if (logoImg && logoImg.width > 0) {
        push(); resetMatrix();
        let lW = isMobile ? 55 : 150;
        let lH = (logoImg.height / logoImg.width) * lW;
        image(logoImg, 15, isMobile ? height - 125 : height - lH - 25, lW, lH);
        pop();
    }
}

function renderQuadrat(code, sD) {
    let m = Array(17).fill().map(() => Array(17).fill(0));
    let p = (dirSelect.value() === 'b') ? [...code].reverse() : [...code];
    let fP = [...p, ...[...p].reverse()];
    for(let i=0; i<16; i++) m[16][i] = fP[i];
    for(let r=15; r>=1; r--) for(let i=0; i<r; i++) m[r][i] = ex(m[r+1][i], m[r+1][i+1]);
    let sz = 22; stroke(0, 30);
    for(let r=1; r<=16; r++) {
        for(let i=0; i<r; i++) {
            let v = m[r][i]; if (v === 0) continue;
            fill(getSliderColor(colorMatrixWabe[sD][v-1], v));
            let x = (i-(r-1)/2)*sz, y = (r-1)*sz;
            rect(x-sz/2, y-sz/2, sz, sz); rect(-x-sz/2, -y-sz/2, sz, sz);
            rect(-y-sz/2, x-sz/2, sz, sz); rect(y-sz/2, -x-sz/2, sz, sz);
        }
    }
}

function renderRund(code, sD) {
    let n = 16, m = Array.from({length: n}, (_, r) => Array(r + 1).fill(0));
    let p = (dirSelect.value() === 'b') ? [...code].reverse() : [...code];
    let base = [...p].reverse().concat(p);
    for (let i=0; i<16; i++) m[15][i] = base[i];
    for (let i=0; i<16; i++) { let r=15-i; m[r][0]=base[i]; m[r][r]=base[i]; }
    for (let r=14; r>=0; r--) for (let c=1; c<r; c++) m[r][c] = ex(m[r+1][c-1], m[r+1][c]);
    let cols = getRundColors(sD), sc = int(sektS.value()), step = 20, h = tan(PI/sc)*step;
    stroke(0, 35); strokeWeight(0.5);
    for (let s=0; s<sc; s++) {
        push(); rotate(s * TWO_PI / sc);
        for (let r=0; r<16; r++) {
            for (let c=0; c<=r; c++) {
                let v = m[r][c];
                fill(v >= 1 ? getSliderColor(cols[v-1], v) : 255);
                let x = r*step, y = (c-r/2)*h*2;
                beginShape(); vertex(x, y); vertex(x+step, y-h); vertex(x+step*2, y); vertex(x+step, y+h); endShape(CLOSE);
            }
        }
        pop();
    }
}

function renderWabe(code, sD) {
    let sz = 16.2, p = (dirSelect.value() === 'b') ? [...code, ...[...code].reverse()] : [...[...code].reverse(), ...code];
    stroke(0, 35);
    for (let s=0; s<6; s++) {
        push(); rotate(s * PI / 3);
        let m = Array(17).fill().map(() => Array(17).fill(0));
        for (let i=0; i<16; i++) m[16][i] = p[i % p.length];
        for (let r=15; r>=1; r--) for (let i=0; i<r; i++) m[r][i] = ex(m[r+1][i], m[r+1][i+1]);
        for (let r=1; r<=16; r++) {
            for (let i=0; i<r; i++) {
                let v = m[r][i];
                fill(v >= 1 ? getSliderColor(colorMatrixWabe[sD][v-1], v) : 255);
                let x = (i-(r-1)/2)*sz*sqrt(3), y = -(r-1)*sz*1.5;
                beginShape(); for (let a=PI/6; a<TWO_PI; a+=PI/3) vertex(x+cos(a)*sz, y+sin(a)*sz); endShape(CLOSE);
            }
        }
        pop();
    }
}

function getSliderColor(hex, idx) {
    let col = color(hex);
    return color(hue(col), map(sliders[idx].value(), 20, 100, 15, saturation(col)), map(sliders[idx].value(), 20, 100, 98, brightness(col)));
}

function updateIndicators(s, d) {
    for (var i = 1; i <= 9; i++) {
        let col = (d === 'Rund') ? getRundColors(s)[i-1] : colorMatrixWabe[s][i-1];
        colorIndicators[i].style('background-color', col);
    }
}

function getRundColors(seed) {
    var shift = (seed - 1) % 9;
    return baseColorsRund.slice(shift).concat(baseColorsRund.slice(0, shift));
}

function getCodeFromText(textStr) {
    var clean = textStr.toUpperCase().replace(/[^A-ZÄÖÜß]/g, "");
    if (clean.length === 0) return [0,0,0,0,0,0,0,0];
    var row = clean.split("").map(c => charMap[c]);
    while(row.length < 8) row.push(9);
    while (row.length > 8) {
        var n = []; for (var i = 0; i < row.length - 1; i++) n.push(ex(row[i], row[i+1]));
        row = n;
    }
    return row;
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); updateLayout(); redraw(); }

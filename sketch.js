// --- GLOBALE VARIABLEN & KONSTANTEN ---
let inputField, modeSelect, designSelect, dirSelect, sektS, sliders = [], colorIndicators = [], sliderPanel, sektGroup;
let logoImg, codeDisplay, qMatrix = [];

const charMap = { 'A':1,'J':1,'S':1,'Ä':1,'B':2,'K':2,'T':2,'Ö':2,'C':3,'L':3,'U':3,'Ü':3,'D':4,'M':4,'V':4,'ß':4,'E':5,'N':5,'W':5,'F':6,'O':6,'X':6,'G':7,'P':7,'Y':7,'H':8,'Q':8,'Z':8,'I':9,'R':9 };
const baseColorsRund = ["#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3"];
const mapZ = { 1: "#FFD670", 2: "#DEAAFF", 3: "#FF686B", 4: "#7A5BEC", 5: "#74FB92", 6: "#E9FF70", 7: "#C0FDFF", 8: "#B2C9FF", 9: "#FFCBF2" };

const colorMatrix = {
    1: { 1: "#FF0000", 2: "#0000FF", 3: "#00FF00", 4: "#FFFF00", 5: "#00B0F0", 6: "#00FFFF", 7: "#FF66FF", 8: "#FF9900", 9: "#9900FF" },
    2: { 1: "#0000FF", 2: "#00FF00", 3: "#FFFF00", 4: "#00B0F0", 5: "#00FFFF", 6: "#FF66FF", 7: "#FF9900", 8: "#9900FF", 9: "#FF0000" },
    3: { 1: "#00FF00", 2: "#FFFF00", 3: "#00B0F0", 4: "#00FFFF", 5: "#FF66FF", 6: "#FF9900", 7: "#9900FF", 8: "#FF0000", 9: "#0000FF" },
    4: { 1: "#FFFF00", 2: "#00B0F0", 3: "#00FFFF", 4: "#FF66FF", 5: "#FF9900", 6: "#9900FF", 7: "#FF0000", 8: "#0000FF", 9: "#00FF00" },
    5: { 1: "#00B0F0", 2: "#00FFFF", 3: "#FF66FF", 4: "#FF9900", 5: "#9900FF", 6: "#FF0000", 7: "#0000FF", 8: "#00FF00", 9: "#FFFF00" },
    6: { 1: "#00FFFF", 2: "#FF66FF", 3: "#FF9900", 4: "#9900FF", 5: "#FF0000", 6: "#0000FF", 7: "#00FF00", 8: "#FFFF00", 9: "#00B0F0" },
    7: { 1: "#FF66FF", 2: "#FF9900", 3: "#9900FF", 4: "#FF0000", 5: "#0000FF", 6: "#00FF00", 7: "#FFFF00", 8: "#00B0F0", 9: "#00FFFF" },
    8: { 1: "#FF9900", 2: "#9900FF", 3: "#FF0000", 4: "#0000FF", 5: "#00FF00", 6: "#FFFF00", 7: "#00B0F0", 8: "#00FFFF", 9: "#FF66FF" },
    9: { 1: "#9900FF", 2: "#FF0000", 3: "#0000FF", 4: "#00FF00", 5: "#FFFF00", 6: "#00B0F0", 7: "#00FFFF", 8: "#FF66FF", 9: "#FF9900" }
};

const ex = (a, b) => { let s = (a || 0) + (b || 0); return (s === 0) ? 0 : (s % 9 === 0 ? 9 : s % 9); };

function preload() { logoImg = loadImage('logo.png'); }

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100);
    let isMobile = windowWidth < 600;

    let topBar = createDiv("").style('position', 'fixed').style('top', '0').style('left', '0').style('width', '100%')
        .style('background', '#2c3e50').style('color', '#fff').style('display', 'flex').style('padding', isMobile ? '4px 6px' : '10px 15px')
        .style('gap', isMobile ? '4px' : '15px').style('font-family', 'sans-serif').style('z-index', '200')
        .style('align-items', 'center').style('box-sizing', 'border-box').style('height', isMobile ? '55px' : '75px');

    function createUIGroup(labelTxt, element, wMobile, wDesktop) {
        let group = createDiv("").parent(topBar).style('display', 'flex').style('flex-direction', 'column');
        createSpan(labelTxt).parent(group).style('font-size', '7px').style('color', '#bdc3c7').style('text-transform', 'uppercase').style('font-weight', 'bold');
        if (element) {
            element.parent(group).style('width', isMobile ? wMobile : wDesktop)
                .style('font-size', isMobile ? '10px' : '13px').style('background', '#34495e').style('color', '#fff')
                .style('border', 'none').style('border-radius', '3px').style('padding', isMobile ? '2px' : '5px');
        }
        return group;
    }

    designSelect = createSelect(); designSelect.option('Rund'); designSelect.option('Quadrat'); designSelect.option('Wabe');
    createUIGroup("DESIGN", designSelect, "65px", "100px");

    modeSelect = createSelect(); modeSelect.option('Geburt'); modeSelect.option('Text');
    createUIGroup("MODUS", modeSelect, "60px", "110px");

    inputField = createInput("15011987");
    createUIGroup("EINGABE", inputField, "70px", "130px");

    let codeGroup = createUIGroup("CODE", null, "auto", "auto");
    codeDisplay = createSpan("").parent(codeGroup).style('font-size', isMobile ? '10px' : '14px').style('color', '#fff').style('font-weight', 'bold');

    sektS = createSelect(); ["6","8","10","12","13"].forEach(s => sektS.option(s)); sektS.selected("8");
    sektGroup = createUIGroup("SEKTOR", sektS, "40px", "60px");

    dirSelect = createSelect(); dirSelect.option("Außen"); dirSelect.option("Innen");
    createUIGroup("RICHTUNG", dirSelect, "60px", "90px");

    let saveBtn = createButton('SAVE').parent(topBar).style('margin-left', 'auto').style('background', '#fff').style('padding', isMobile ? '5px' : '10px').style('font-weight', 'bold').style('border-radius', '4px');
    saveBtn.mousePressed(exportHighRes);

    sliderPanel = createDiv("").style('position', 'fixed').style('background', 'rgba(44, 62, 80, 0.95)').style('z-index', '150');
    for (let i = 1; i <= 9; i++) {
        let sRow = createDiv("").parent(sliderPanel).style('display','flex').style('align-items','center').style('gap','5px');
        colorIndicators[i] = createDiv("").parent(sRow).style('width', '10px').style('height', '10px').style('border-radius', '50%');
        sliders[i] = createSlider(20, 100, 85).parent(sRow).input(() => redraw());
        if (isMobile) sliders[i].style('width', '75px');
    }

    updateLayout();
    [designSelect, modeSelect, inputField, sektS, dirSelect].forEach(e => e.changed(redraw));
}

function updateLayout() {
    let isMobile = windowWidth < 600;
    sliderPanel.style('left', '0').style('width', isMobile ? '100%' : 'auto').style('padding', '10px');
    if (isMobile) {
        sliderPanel.style('top', 'auto').style('bottom', '0').style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)');
    } else {
        sliderPanel.style('bottom', 'auto').style('top', '85px').style('display', 'flex').style('flex-direction', 'column');
    }
}

function draw() {
    background(255);
    let isMobile = windowWidth < 600;
    let design = designSelect.value();
    let baseCode = (modeSelect.value().includes('Geburt')) ? getCodeFromDate() : getCodeFromText();
    let startDigit = baseCode[0] || 1;
    let drawCode = (dirSelect.value().includes('Innen')) ? [...baseCode].reverse() : baseCode;
    
    codeDisplay.html(baseCode.join(""));
    updateIndicators(startDigit);

    if(sektGroup) { if(design === 'Rund') sektGroup.show(); else sektGroup.hide(); }

    push();
    let centerY = isMobile ? height/2 - 45 : height/2 + 25;
    translate(width/2 + (isMobile ? 0 : 50), centerY);
    let scf = (min(width, height) / 850) * (isMobile ? 0.92 : 0.85);
    scale(scf);

    if (design === 'Quadrat') {
        calcQuadratMatrix(drawCode);
        drawQuadrat(startDigit);
    } else if (design === 'Rund') {
        const sector = buildRundSector(drawCode);
        const sc = int(sektS.value());
        for (let i = 0; i < sc; i++) {
            push(); rotate(i * TWO_PI / sc); drawRundSectorShape(sector, startDigit); pop();
        }
    } else if (design === 'Wabe') {
        const sector = buildRundSector(drawCode); // Wabe nutzt Rund-Logik
        for (let i = 0; i < 6; i++) {
            push(); rotate(i * PI/3); drawRundSectorShape(sector, startDigit, true); pop();
        }
    }
    pop();

    if (logoImg) {
        let lW = isMobile ? 55 : 150;
        image(logoImg, 15, height - (isMobile ? 125 : 85), lW, (logoImg.height/logoImg.width)*lW);
    }
}

// --- LOGIK QUADRAT ---
function calcQuadratMatrix(code) {
    qMatrix = Array(20).fill().map(() => Array(20).fill(0));
    let d = [code[0], code[1]], m = [code[2], code[3]], j1 = [code[4], code[5]], j2 = [code[6], code[7]];
    function set2(r, c, v1, v2) {
        if (r >= 20 || c >= 20) return;
        qMatrix[r][c] = v1; if(c+1 < 20) qMatrix[r][c+1] = v2;
        if(r+1 < 20) qMatrix[r+1][c] = v2; if(r+1 < 20 && c+1 < 20) qMatrix[r+1][c+1] = v1;
    }
    for(let i = 0; i < 8; i+=2) set2(i, i, d[0], d[1]);
    for(let i = 0; i < 6; i+=2) { set2(i, i+2, m[0], m[1]); set2(i+2, i, m[0], m[1]); }
    for(let i = 0; i < 4; i+=2) { set2(i, i+4, j1[0], j1[1]); set2(i+4, i, j1[0], j1[1]); }
    set2(0, 6, j2[0], j2[1]); set2(6, 0, j2[0], j2[1]);
    for(let r = 0; r < 8; r++) { for(let c = 8; c < 20; c++) qMatrix[r][c] = ex(qMatrix[r][c-2], qMatrix[r][c-1]); }
    for(let c = 0; c < 20; c++) { for(let r = 8; r < 20; r++) qMatrix[r][c] = ex(qMatrix[r-2][c], qMatrix[r-1][c]); }
}

function drawQuadrat(startDigit, target) {
    let ctx = target || window;
    let ts = 16; ctx.stroke(0, 35); ctx.strokeWeight(0.5);
    for (let r = 0; r < 20; r++) {
        for (let c = 0; c < 20; c++) {
            let val = qMatrix[r][c];
            if (val !== 0) {
                ctx.fill(getFinalColor(val, startDigit));
                ctx.rect(c * ts, -(r + 1) * ts, ts, ts); ctx.rect(-(c + 1) * ts, -(r + 1) * ts, ts, ts);
                ctx.rect(c * ts, r * ts, ts, ts); ctx.rect(-(c + 1) * ts, r * ts, ts, ts);
            }
        }
    }
}

// --- LOGIK RUND ---
function buildRundSector(raw) {
    const n = 16; let m = Array.from({length: n}, (_, r) => Array(r + 1).fill(0));
    const base = [...raw].reverse().concat(raw);
    for (let i = 0; i < 16; i++) m[15][i] = base[i];
    for (let i = 0; i < 16; i++) { let r = 15 - i; m[r][0] = base[i]; m[r][r] = base[i]; }
    for (let c = 1; c <= 13; c++) m[14][c] = ex(m[15][c], m[15][c + 1]);
    const c14 = (c, t) => t.forEach(([r, k]) => m[r][k] = m[14][c]);
    c14(1, [[2, 1]]); c14(2, [[3, 1], [3, 2], [13, 1], [13, 12]]); c14(3, [[4, 1], [4, 3], [12, 1], [12, 11]]);
    c14(4, [[5, 1], [5, 4], [11, 1], [11, 10]]); c14(5, [[6, 1], [6, 5], [10, 1], [10, 9]]);
    c14(6, [[7, 1], [7, 6], [9, 1], [9, 8]]); c14(7, [[8, 1], [8, 7]]);
    for (let c = 2; c <= 10; c++) m[13][c] = ex(m[14][c], m[14][c + 1]);
    const c13 = (c, t) => t.forEach(([r, k]) => m[r][k] = m[13][c]);
    c13(2, [[4, 2], [13, 11]]); c13(3, [[12, 2], [12, 10], [5, 2], [5, 3]]);
    c13(4, [[11, 2], [11, 9], [6, 4], [6, 2]]); c13(5, [[10, 2], [10, 8], [7, 5], [7, 2]]);
    c13(6, [[9, 2], [9, 7], [8, 6], [8, 2]]);
    for (let j = 3; j <= 8; j++) m[12][j] = ex(m[13][j], m[13][j+1]);
    const c12 = (c, t) => t.forEach(([r, k]) => m[r][k] = m[12][c]);
    c12(3, [[12, 9], [6, 3]]); c12(4, [[11, 3], [11, 8], [7, 4], [7, 3]]);
    c12(5, [[10, 3], [10, 7], [8, 5], [8, 3]]); c12(6, [[9, 3], [9, 6]]);
    m[11][4] = ex(m[12][4], m[12][5]); m[11][5] = ex(m[12][5], m[12][6]); m[11][6] = ex(m[12][6], m[12][7]);
    const c11 = (c, t) => t.forEach(([r, k]) => m[r][k] = m[11][c]);
    c11(4, [[11, 7], [8, 4]]); c11(5, [[10, 4], [10, 6], [9, 4], [9, 5]]);
    m[10][5] = ex(m[11][5], m[11][6]);
    return m;
}

function drawRundSectorShape(m, startDigit, isWabe) {
    const step = 20;
    const sc = isWabe ? 6 : int(sektS.value());
    const h = tan(PI / sc) * step;
    stroke(0, 35); strokeWeight(0.5);
    for (let r = 0; r < m.length; r++) {
        for (let c = 0; c <= r; c++) {
            const v = m[r][c];
            if (v >= 1) {
                fill(getFinalColor(v, startDigit));
                let x = r * step; let y = (c - r / 2) * h * 2;
                beginShape(); vertex(x, y); vertex(x+step, y-h); vertex(x+step*2, y); vertex(x+step, y+h); endShape(CLOSE);
            }
        }
    }
}

// --- HELFER ---
function getFinalColor(v, startDigit) {
    let hex = (colorMatrix[startDigit] && colorMatrix[startDigit][v]) ? colorMatrix[startDigit][v] : mapZ[v];
    let col = color(hex);
    let sVal = sliders[v] ? sliders[v].value() : 85;
    return color(hue(col), map(sVal, 20, 100, 15, saturation(col)), map(sVal, 20, 100, 98, brightness(col)));
}

function updateIndicators(startDigit) {
    for (let i = 1; i <= 9; i++) {
        let hex = (colorMatrix[startDigit] && colorMatrix[startDigit][i]) ? colorMatrix[startDigit][i] : mapZ[i];
        if(colorIndicators[i]) colorIndicators[i].style('background-color', hex);
    }
}

function getCodeFromDate() { let val = inputField.value().replace(/[^0-9]/g, ""); let res = val.split('').map(Number); while (res.length < 8) res.push(0); return res.slice(0, 8); }

function getCodeFromText() { 
    let textStr = inputField.value().toUpperCase().replace(/[^A-ZÄÖÜß]/g, "");
    let row = []; for (let char of textStr) { if (charMap[char]) row.push(charMap[char]); }
    while(row.length < 8) row.push(9);
    while (row.length > 8) { let next = []; for (let i=0; i<row.length-1; i++) next.push(ex(row[i], row[i+1])); row = next; }
    return row.slice(0, 8);
}

function exportHighRes() {
    let pg = createGraphics(2480, 3508); pg.colorMode(HSB, 360, 100, 100); pg.background(255);
    // Export-Logik hier analog zum draw(), nur mit pg. statt ctx.
    save(pg, 'Milz&More_Design.png');
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); updateLayout(); redraw(); }

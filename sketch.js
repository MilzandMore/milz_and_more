// --- GLOBALE VARIABLEN ---
let inputField, modeSelect, designSelect, dirSelect, sektS, sliders = [], colorIndicators = [], sliderPanel, sektGroup;
let logoImg, codeDisplay, qMatrix = [];

const charMap = {'A':1,'J':1,'S':1,'Ä':1,'B':2,'K':2,'T':2,'Ö':2,'C':3,'L':3,'U':3,'Ü':3,'D':4,'M':4,'V':4,'ß':4,'E':5,'N':5,'W':5,'F':6,'O':6,'X':6,'G':7,'P':7,'Y':7,'H':8,'Q':8,'Z':8,'I':9,'R':9};
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

function preload() { logoImg = loadImage('logo.png'); }

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100);
    let isMobile = windowWidth < 600;

    let topBar = createDiv("").style('position', 'fixed').style('top', '0').style('left', '0').style('width', '100%')
        .style('background', '#2c3e50').style('color', '#fff').style('display', 'flex').style('padding', isMobile ? '4px' : '10px')
        .style('gap', isMobile ? '4px' : '15px').style('z-index', '200').style('align-items', 'center').style('height', isMobile ? '50px' : '70px');

    function createUIGroup(labelTxt, element, wMobile, wDesktop) {
        let group = createDiv("").parent(topBar).style('display', 'flex').style('flex-direction', 'column');
        createSpan(labelTxt).parent(group).style('font-size', '8px').style('color', '#bdc3c7').style('text-transform', 'uppercase').style('font-weight', 'bold');
        if (element) {
            element.parent(group).style('width', isMobile ? wMobile : wDesktop)
                .style('font-size', isMobile ? '10px' : '12px').style('background', '#34495e').style('color', '#fff').style('border', 'none');
        }
        return group;
    }

    designSelect = createSelect(); ["Mandala", "Quadrat"].forEach(o => designSelect.option(o));
    createUIGroup("DESIGN", designSelect, "65px", "100px");

    modeSelect = createSelect(); modeSelect.option('Geburt'); modeSelect.option('Text');
    createUIGroup("MODUS", modeSelect, "60px", "100px");

    inputField = createInput('15011987');
    createUIGroup("EINGABE", inputField, "70px", "120px");

    let codeGroup = createUIGroup("CODE", null, "auto", "auto");
    codeDisplay = createSpan("").parent(codeGroup).style('color', '#fff').style('font-weight', 'bold').style('font-size', isMobile ? '10px' : '14px');

    sektS = createSelect(); ["6","8","10","12"].forEach(s => sektS.option(s)); sektS.selected("8");
    sektGroup = createUIGroup("SEKTOR", sektS, "40px", "60px");

    dirSelect = createSelect(); dirSelect.option('Außen'); dirSelect.option('Innen');
    createUIGroup("RICHTUNG", dirSelect, "60px", "90px");

    sliderPanel = createDiv("").style('position', 'fixed').style('background', 'rgba(44, 62, 80, 0.95)').style('z-index', '150').style('padding', '10px');
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
    if (isMobile) {
        sliderPanel.style('top', 'auto').style('bottom', '0').style('left', '0').style('width', '100%').style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)');
    } else {
        sliderPanel.style('bottom', 'auto').style('top', '80px').style('left', '0').style('display', 'flex').style('flex-direction', 'column');
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
    if (design === "Mandala") sektGroup.show(); else sektGroup.hide();

    push();
    let centerY = isMobile ? height/2 - 40 : height/2 + 20;
    translate(width/2 + (isMobile ? 0 : 50), centerY);
    scale((min(width, height) / 850) * (isMobile ? 0.95 : 0.8));

    if (design === "Quadrat") {
        calcQuadratMatrix(drawCode);
        drawQuadrat(startDigit);
    } else {
        drawOriginalMandala(drawCode, startDigit);
    }
    pop();

    if (logoImg) {
        let lW = isMobile ? 55 : 150;
        image(logoImg, 15, height - (isMobile ? 130 : 80), lW, (logoImg.height/logoImg.width)*lW);
    }
}

// --- DEINE ORIGINAL MANDALA LOGIK ---
function drawOriginalMandala(code, startDigit) {
    let sc = int(sektS.value());
    let ts = 16;
    for (let s = 0; s < sc; s++) {
        push();
        rotate(s * TWO_PI / sc);
        let currentLevel = [...code];
        for (let r = 0; r < 8; r++) {
            for (let i = 0; i < currentLevel.length; i++) {
                fill(getCol(currentLevel[i], startDigit));
                rect(i * ts - (currentLevel.length * ts)/2, r * ts, ts, ts);
            }
            let nextLevel = [];
            for (let i = 0; i < currentLevel.length - 1; i++) {
                nextLevel.push(ex(currentLevel[i], currentLevel[i+1]));
            }
            currentLevel = nextLevel;
        }
        pop();
    }
}

// --- DEINE QUADRAT LOGIK ---
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

function drawQuadrat(startDigit) {
    let ts = 16; stroke(0, 35);
    for (let r = 0; r < 20; r++) {
        for (let c = 0; c < 20; c++) {
            let val = qMatrix[r][c];
            if (val !== 0) {
                fill(getCol(val, startDigit));
                rect(c * ts, -(r + 1) * ts, ts, ts); rect(-(c + 1) * ts, -(r + 1) * ts, ts, ts); 
                rect(c * ts, r * ts, ts, ts); rect(-(c + 1) * ts, r * ts, ts, ts);
            }
        }
    }
}

function getCol(val, startDigit) {
    let hex = (colorMatrix[startDigit] && colorMatrix[startDigit][val]) ? colorMatrix[startDigit][val] : mapZ[val];
    let col = color(hex);
    let sVal = sliders[val] ? sliders[val].value() : 85;
    if(colorIndicators[val]) colorIndicators[val].style('background-color', hex);
    return color(hue(col), map(sVal, 20, 100, 15, saturation(col)), map(sVal, 20, 100, 98, brightness(col)));
}

function ex(a, b) { let s = (a || 0) + (b || 0); return (s === 0) ? 0 : (s % 9 === 0 ? 9 : s % 9); }
function getCodeFromDate() { let val = inputField.value().replace(/[^0-9]/g, ""); let res = val.split('').map(Number); while (res.length < 8) res.push(0); return res.slice(0, 8); }
function getCodeFromText() { 
    let textStr = inputField.value().toUpperCase().replace(/[^A-ZÄÖÜß]/g, "");
    let row = []; for (let char of textStr) { if (charMap[char]) row.push(charMap[char]); }
    while(row.length < 8) row.push(9);
    while (row.length > 8) { let next = []; for (let i=0; i<row.length-1; i++) next.push(ex(row[i], row[i+1])); row = next; }
    return row.slice(0, 8);
}
function windowResized() { resizeCanvas(windowWidth, windowHeight); updateLayout(); redraw(); }

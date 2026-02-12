// --- DEINE LOGIK VARIABLEN ---
var inputField, designSelect, logoImg;
const charMap = { 'A':1,'J':1,'S':1,'Ä':1,'B':2,'K':2,'T':2,'Ö':2,'C':3,'L':3,'U':3,'Ü':3,'D':4,'M':4,'V':4,'ß':4,'E':5,'N':5,'W':5,'F':6,'O':6,'X':6,'G':7,'P':7,'Y':7,'H':8,'Q':8,'Z':8,'I':9,'R':9 };
const colors = ["#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3"];

// Deine Kern-Funktion
const ex = (a, b) => (a + b === 0) ? 0 : ((a + b) % 9 === 0 ? 9 : (a + b) % 9);

function preload() {
    logoImg = loadImage('Logo.png');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    inputField = createInput('15011987');
    inputField.position(20, 20);
    inputField.style('width', '150px');
    
    designSelect = createSelect();
    designSelect.position(180, 20);
    designSelect.option('Quadrat');
    designSelect.option('Wabe');
}

function draw() {
    background(255);
    let val = inputField.value().replace(/\D/g, "");
    if (val.length < 1) return;
    let code = val.split('').map(Number);
    while (code.length < 8) code.push(0);

    translate(width/2, height/2);
    
    if (designSelect.value() === 'Quadrat') {
        renderEchtesQuadrat(code.slice(0, 8));
    } else {
        // Hier käme deine Waben-Logik hin
        ellipse(0,0,50,50); 
    }
}

function renderEchtesQuadrat(p) {
    let m = Array(17).fill().map(() => Array(17).fill(0));
    // Deine Spiegel-Logik
    let fP = [...p, ...[...p].reverse()];
    for(let i=0; i<16; i++) m[16][i] = fP[i];
    for(let r=15; r>=1; r--) {
        for(let i=0; i<r; i++) m[r][i] = ex(m[r+1][i], m[r+1][i+1]);
    }
    
    let sz = 20;
    stroke(0, 40);
    for(let r=1; r<=16; r++) {
        for(let i=0; i<r; i++) {
            let v = m[r][i];
            if (v > 0) {
                fill(colors[v-1]);
                let x = (i-(r-1)/2)*sz, y = (r-1)*sz;
                // Die 4-fach Spiegelung für das echte Mandala
                rect(x-sz/2, y-sz/2, sz, sz); 
                rect(-x-sz/2, -y-sz/2, sz, sz);
                rect(-y-sz/2, x-sz/2, sz, sz); 
                rect(y-sz/2, -x-sz/2, sz, sz);
            }
        }
    }
}

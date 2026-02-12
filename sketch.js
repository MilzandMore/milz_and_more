// --- GLOBALE VARIABLEN ---
var inputField, designSelect, logoImg;
const charMap = { 'A':1,'J':1,'S':1,'Ä':1,'B':2,'K':2,'T':2,'Ö':2,'C':3,'L':3,'U':3,'Ü':3,'D':4,'M':4,'V':4,'ß':4,'E':5,'N':5,'W':5,'F':6,'O':6,'X':6,'G':7,'P':7,'Y':7,'H':8,'Q':8,'Z':8,'I':9,'R':9 };
const colors = ["#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3"];

// Deine Kern-Logik (Die Quersumme/9er-Logik)
const ex = (a, b) => (a + b === 0) ? 0 : ((a + b) % 9 === 0 ? 9 : (a + b) % 9);

function preload() {
    logoImg = loadImage('Logo.png');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    // Einfache, stabile Steuerung
    inputField = createInput('15011987');
    inputField.position(20, 20);
    inputField.style('width', '150px');
    
    designSelect = createSelect();
    designSelect.position(180, 20);
    designSelect.option('Quadrat');
    designSelect.option('Rund');
}

function draw() {
    background(255);
    let val = inputField.value().replace(/\D/g, "");
    if (val.length < 1) return;
    
    // Code auf 8 Stellen bringen
    let code = val.split('').map(Number);
    while (code.length < 8) code.push(0);
    code = code.slice(0, 8);

    translate(width/2, height/2);
    
    if (designSelect.value() === 'Quadrat') {
        renderQuadrat(code);
    } else {
        renderRund(code);
    }

    // Logo (fest unten links)
    if (logoImg) {
        resetMatrix();
        image(logoImg, 20, height - 70, 120, 50);
    }
}

function renderQuadrat(p) {
    let m = Array(17).fill().map(() => Array(17).fill(0));
    // Deine Spiegel-Basis: 8 Zahlen hin, 8 Zahlen zurück gespiegelt
    let fP = [...p, ...[...p].reverse()];
    for(let i=0; i<16; i++) m[16][i] = fP[i];
    
    // Die Pyramide nach oben berechnen mit ex()
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
                // Echte Mandala-Spiegelung (4-fach)
                rect(x-sz/2, y-sz/2, sz, sz); 
                rect(-x-sz/2, -y-sz/2, sz, sz);
                rect(-y-sz/2, x-sz/2, sz, sz); 
                rect(y-sz/2, -x-sz/2, sz, sz);
            }
        }
    }
}

function renderRund(p) {
    let n = 16, m = Array.from({length: n}, (_, r) => Array(r + 1).fill(0));
    // Basis-Reihe für das Rund-Design
    let base = [...p].reverse().concat(p);
    for (let i=0; i<16; i++) m[15][i] = base[i];
    
    // Pyramiden-Logik für Rund
    for (let i=0; i<16; i++) { let r=15-i; m[r][0]=base[i]; m[r][r]=base[i]; }
    for (let r=14; r>=0; r--) {
        for (let c=1; c<r; c++) m[r][c] = ex(m[r+1][c-1], m[r+1][c]);
    }
    
    let sc = 8; // 8 Sektoren Standard
    let step = 18, h = tan(PI/sc)*step;
    stroke(0, 30);
    for (let s=0; s<sc; s++) {
        push(); rotate(s * TWO_PI / sc);
        for (let r=0; r<16; r++) {
            for (let c=0; c<=r; c++) {
                let v = m[r][c];
                if(v > 0) {
                    fill(colors[v-1]);
                    let x = r*step, y = (c-r/2)*h*2;
                    beginShape(); vertex(x, y); vertex(x+step, y-h); vertex(x+step*2, y); vertex(x+step, y+h); endShape(CLOSE);
                }
            }
        }
        pop();
    }
}

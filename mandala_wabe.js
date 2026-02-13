// MANDALA_WABE.JS

// HINWEIS: KEINE erneute Deklaration von logoImg, inputD etc. hier! 
// Diese müssen in der sketch.js stehen.

// Die Logik-Funktion, die von sketch.js aufgerufen wird
function calcWabeMatrixLogic(path) {
    var m = Array(17).fill().map(() => Array(17).fill(0));
    // Initialisierung der untersten Reihe mit dem Pfad
    for (var i = 0; i < 16; i++) {
        m[16][i] = path[i % path.length];
    }
    // Berechnung der restlichen Matrix nach der numerologischen Formel
    for (var r = 15; r >= 1; r--) {
        for (var i = 0; i < r; i++) {
            m[r][i] = ex(m[r+1][i], m[r+1][i+1]);
        }
    }
    return m;
}

// Die Render-Funktion für die Wabe
function drawWabe(code, cKey, target) {
    var ctx = target || window; 
    var sz = 16.2;
    ctx.stroke(0, 35);
    
    // Richtung bestimmen
    var path = (dirS.value().includes('innen')) 
        ? [...code, ...[...code].reverse()] 
        : [...[...code].reverse(), ...code];
    
    // Matrix berechnen
    var m = calcWabeMatrixLogic(path);

    // 6-fache Symmetrie zeichnen
    for (var s = 0; s < 6; s++) {
        ctx.push(); 
        ctx.rotate(s * PI / 3);
        for (var r = 1; r <= 16; r++) {
            for (var i = 0; i < r; i++) {
                var val = m[r][i];
                if (val >= 1 && val <= 9) {
                    var col = color(colorMatrix[cKey][val - 1]);
                    // Sättigung und Helligkeit über Slider steuern
                    ctx.fill(
                        hue(col), 
                        map(sliders[val].value(), 20, 100, 15, saturation(col)), 
                        map(sliders[val].value(), 20, 100, 98, brightness(col))
                    );
                } else {
                    ctx.fill(255);
                }
                var x = (i - (r - 1) / 2) * sz * sqrt(3);
                var y = -(r - 1) * sz * 1.5;
                
                // Hexagon-Form zeichnen
                ctx.beginShape(); 
                for (var a = PI / 6; a < TWO_PI; a += PI / 3) {
                    ctx.vertex(x + cos(a) * sz, y + sin(a) * sz);
                }
                ctx.endShape(CLOSE);
            }
        }
        ctx.pop();
    }
}

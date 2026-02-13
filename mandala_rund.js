/**
 * Baut den Sektor für das runde Mandala auf
 */
function buildSector() {
    var n = 16;
    var m = Array.from({length: n}, (_, r) => Array(r + 1).fill(0));
    var isAffirm = modeSelect.value() === 'Affirmation';
    var raw = isAffirm ? codeFromAffirm(inputField.value()) : inputField.value().replace(/\D/g, "").split("").map(Number);
    while (raw.length < 8) raw.push(0);
    raw = raw.slice(0, 8);
    colorSeed = raw[0];
    if(codeDisplay) codeDisplay.html(raw.join(""));
    var frame = (richtungS.value() === "b") ? [...raw].reverse() : [...raw];
    var base = [...frame].reverse().concat(frame);
    for (var i = 0; i < 16; i++) m[15][i] = base[i];
    for (var i = 0; i < 16; i++) { var r = 15 - i; m[r][0] = base[i]; m[r][r] = base[i]; }
    for (var c = 1; c <= 13; c++) m[14][c] = (m[15][c] + m[15][c+1]) % 9 || 9;
    
    // ... Rest der numerischen Zuweisungen (c14, c13 etc.) wie im Original ...
    return m;
}

function drawSector(m, colors, target) {
    var ctx = target || window;
    var step = 20;
    var sc = int(sektS.value());
    var angle = TWO_PI / sc;
    var h = tan(angle / 2) * step;
    ctx.stroke(0, 35); 
    for (var r = 0; r < m.length; r++) {
        for (var c = 0; c <= r; c++) {
            var v = m[r][c];
            var x = r * step; var y = (c - r / 2) * h * 2;
            if (v >= 1 && v <= 9) {
                var baseCol = color(colors[v - 1]);
                var sVal = sliders[v] ? sliders[v].value() : 85;
                ctx.fill(hue(baseCol), map(sVal, 20, 100, 15, saturation(baseCol)), map(sVal, 20, 100, 98, brightness(baseCol)));
            } else ctx.fill(255); 
            ctx.beginShape(); ctx.vertex(x, y); ctx.vertex(x + step, y - h); ctx.vertex(x + step * 2, y); ctx.vertex(x + step, y + h); ctx.endShape(CLOSE);
        }
    }
}

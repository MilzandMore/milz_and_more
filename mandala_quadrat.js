/**
 * Berechnet die Matrix für das Quadrat
 */
function calcQuadratMatrix(code) {
    qMatrix = Array(20).fill().map(() => Array(20).fill(0));
    var d = [code[0], code[1]], m = [code[2], code[3]], j1 = [code[4], code[5]], j2 = [code[6], code[7]];
    function set2(r, c, v1, v2) { if (r >= 20 || c >= 20) return; qMatrix[r][c] = v1; if(c+1 < 20) qMatrix[r][c+1] = v2; if(r+1 < 20) qMatrix[r+1][c] = v2; if(r+1 < 20 && c+1 < 20) qMatrix[r+1][c+1] = v1; }
    for(var i = 0; i < 8; i+=2) set2(i, i, d[0], d[1]);
    for(var i = 0; i < 6; i+=2) { set2(i, i+2, m[0], m[1]); set2(i+2, i, m[0], m[1]); }
    for(var i = 0; i < 4; i+=2) { set2(i, i+4, j1[0], j1[1]); set2(i+4, i, j1[0], j1[1]); }
    set2(0, 6, j2[0], j2[1]); set2(6, 0, j2[0], j2[1]);
    for(var r = 0; r < 8; r++) { for(var c = 8; c < 20; c++) qMatrix[r][c] = (qMatrix[r][c-2] + qMatrix[r][c-1]) % 9 || 9; }
    for(var c = 0; c < 20; c++) { for(var r = 8; r < 20; r++) qMatrix[r][c] = (qMatrix[r-2][c] + qMatrix[r-1][c]) % 9 || 9; }
}

function drawQuadrat(startDigit, target) {
    var ctx = target || window;
    var ts = 16;
    ctx.stroke(0, 35);
    for (var r = 0; r < 20; r++) {
        for (var c = 0; c < 20; c++) {
            var val = qMatrix[r][c];
            if (val !== 0) {
                var hex = (colorMatrix[startDigit] && colorMatrix[startDigit][val]) ? colorMatrix[startDigit][val] : "#FFFFFF";
                var col = color(hex);
                var sVal = sliders[val] ? sliders[val].value() : 85;
                ctx.fill(hue(col), map(sVal, 20, 100, 15, saturation(col)), map(sVal, 20, 100, 98, brightness(col)));
                ctx.rect(c * ts, -(r + 1) * ts, ts, ts); ctx.rect(-(c + 1) * ts, -(r + 1) * ts, ts, ts); 
                ctx.rect(c * ts, r * ts, ts, ts); ctx.rect(-(c + 1) * ts, r * ts, ts, ts);        
            }
        }
    }
}

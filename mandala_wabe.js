function renderWabeKorrekt(code, cKey, target) {
    var ctx = target || window; 
    var sz = 16.2; // Dein Originalwert
    ctx.stroke(0, 35);
    var path = (dirS.value().includes('innen')) ? [...code, ...[...code].reverse()] : [...[...code].reverse(), ...code];
    
    for (var s = 0; s < 6; s++) {
        ctx.push(); 
        ctx.rotate(s * PI / 3); 
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
                
                // DEINE ORIGINAL-MATHEMATIK (NICHT ANTASTEN!)
                var x = (i - (r - 1) / 2) * sz * sqrt(3);
                var y = -(r - 1) * sz * 1.5;
                
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

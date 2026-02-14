var colorMatrixWabe = {
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

function renderWabe(code, startDigit, target) {
    var ctx = target || window;
    var sz = 16.2;
    var exW = (a, b) => (a + b === 0) ? 0 : ((a + b) % 9 === 0 ? 9 : (a + b) % 9);
    ctx.stroke(0, 35);
    var path = (dirS.value().includes('innen')) ? [...code, ...[...code].reverse()] : [...[...code].reverse(), ...code];
    for (var s = 0; s < 6; s++) {
        ctx.push(); ctx.rotate(s * PI / 3);
        var m = Array(17).fill().map(() => Array(17).fill(0));
        for (var i = 0; i < 16; i++) m[16][i] = path[i % path.length];
        for (var r = 15; r >= 1; r--) for (var i = 0; i < r; i++) m[r][i] = exW(m[r+1][i], m[r+1][i+1]);
        for (var r = 1; r <= 16; r++) {
            for (var i = 0; i < r; i++) {
                var val = m[r][i];
                if (val >= 1 && val <= 9) {
                    var col = color(colorMatrixWabe[startDigit][val - 1]);
                    ctx.fill(hue(col), map(sliders[val].value(), 20, 100, 15, saturation(col)), map(sliders[val].value(), 20, 100, 98, brightness(col)));
                } else ctx.fill(255);
                var x = (i - (r - 1) / 2) * sz * sqrt(3), y = -(r - 1) * sz * 1.5;
                ctx.beginShape(); for (var a = PI / 6; a < TWO_PI; a += PI / 3) ctx.vertex(x + cos(a) * sz, y + sin(a) * sz); ctx.endShape(CLOSE);
            }
        }
        ctx.pop();
    }
}var colorMatrixWabe = {
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

function renderWabe(code, startDigit, target) {
    var ctx = target || window;
    var sz = 16.2;
    var exW = (a, b) => (a + b === 0) ? 0 : ((a + b) % 9 === 0 ? 9 : (a + b) % 9);
    ctx.stroke(0, 35);
    var path = (dirS.value().includes('innen')) ? [...code, ...[...code].reverse()] : [...[...code].reverse(), ...code];
    for (var s = 0; s < 6; s++) {
        ctx.push(); ctx.rotate(s * PI / 3);
        var m = Array(17).fill().map(() => Array(17).fill(0));
        for (var i = 0; i < 16; i++) m[16][i] = path[i % path.length];
        for (var r = 15; r >= 1; r--) for (var i = 0; i < r; i++) m[r][i] = exW(m[r+1][i], m[r+1][i+1]);
        for (var r = 1; r <= 16; r++) {
            for (var i = 0; i < r; i++) {
                var val = m[r][i];
                if (val >= 1 && val <= 9) {
                    var col = color(colorMatrixWabe[startDigit][val - 1]);
                    ctx.fill(hue(col), map(sliders[val].value(), 20, 100, 15, saturation(col)), map(sliders[val].value(), 20, 100, 98, brightness(col)));
                } else ctx.fill(255);
                var x = (i - (r - 1) / 2) * sz * sqrt(3), y = -(r - 1) * sz * 1.5;
                ctx.beginShape(); for (var a = PI / 6; a < TWO_PI; a += PI / 3) ctx.vertex(x + cos(a) * sz, y + sin(a) * sz); ctx.endShape(CLOSE);
            }
        }
        ctx.pop();
    }
}

var colorMatrixWabe = ["#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3"];

function renderWabe(code, startDigit, target) {
    var ctx = target || window;
    var sz = 18;
    var currentColors = colorMatrixWabe.slice((startDigit-1)%9).concat(colorMatrixWabe.slice(0, (startDigit-1)%9));
    ctx.stroke(0, 30);
    for (var s = 0; s < 6; s++) {
        ctx.push(); ctx.rotate(s * PI / 3);
        for (var r = 0; r < 12; r++) {
            var val = code[r % code.length];
            if (val > 0) {
              var col = color(currentColors[val-1] || "#ccc");
              ctx.fill(hue(col), map(sliders[val].value(), 20, 100, 15, saturation(col)), brightness(col));
              var x = r * sz * 1.5, y = 0;
              ctx.beginShape(); 
              for (var a = 0; a < TWO_PI; a += PI / 3) {
                ctx.vertex(x + cos(a) * sz, y + sin(a) * sz);
              }
              ctx.endShape(CLOSE);
            }
        }
        ctx.pop();
    }
}

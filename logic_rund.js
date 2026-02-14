var baseColorsRund = ["#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3"];

function renderRund(drawCode, startDigit, target) {
  var ctx = target || window;
  var sc = int(sektS.value());
  var angle = TWO_PI / sc;
  var currentColors = baseColorsRund.slice((startDigit-1)%9).concat(baseColorsRund.slice(0, (startDigit-1)%9));
  
  for (var i = 0; i < sc; i++) {
    ctx.push();
    ctx.rotate(i * angle);
    drawSectorRund(drawCode, currentColors, ctx);
    ctx.pop();
  }
}

function drawSectorRund(code, colors, ctx) {
  var step = 22;
  ctx.stroke(0, 30);
  for (var r = 0; r < 15; r++) {
    var val = code[r % code.length];
    if (val > 0) {
      var col = color(colors[val-1] || "#ccc");
      ctx.fill(hue(col), map(sliders[val].value(), 20, 100, 15, saturation(col)), brightness(col));
      ctx.ellipse(r * step, 0, step, step);
    }
  }
}

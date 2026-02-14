var baseColorsRund = ["#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3"];

function renderRund(drawCode, startDigit, target) {
  var ctx = target || window;
  var sector = buildSectorRund(drawCode);
  var currentColors = getColorMatrixRund(startDigit);
  var sc = int(sektS.value());
  var angle = TWO_PI / sc;

  for (var i = 0; i < sc; i++) {
    ctx.push();
    ctx.rotate(i * angle);
    drawSectorRund(sector, currentColors, ctx);
    ctx.pop();
  }
}

function drawSectorRund(m, colors, ctx) {
  var step = 20;
  var sc = int(sektS.value());
  var angle = TWO_PI / sc;
  var h = tan(angle / 2) * step;
  ctx.stroke(0, 35); ctx.strokeWeight(0.5);
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

function buildSectorRund(raw) {
  var n = 16;
  var m = Array.from({length: n}, (_, r) => Array(r + 1).fill(0));
  var exR = (a, b) => (a + b) % 9 === 0 ? 9 : (a + b) % 9;
  var frame = [...raw];
  var base = [...frame].reverse().concat(frame);
  for (var i = 0; i < 16; i++) m[15][i] = base[i];
  for (var i = 0; i < 16; i++) { var r = 15 - i; m[r][0] = base[i]; m[r][r] = base[i]; }
  for (var c = 1; c <= 13; c++) m[14][c] = exR(m[15][c], m[15][c + 1]);
  var c14 = (c, t) => t.forEach(([r, k]) => m[r][k] = m[14][c]);
  c14(1, [[2, 1]]); c14(2, [[3, 1], [3, 2], [13, 1], [13, 12]]); c14(3, [[4, 1], [4, 3], [12, 1], [12, 11]]);
  c14(4, [[5, 1], [5, 4], [11, 1], [11, 10]]); c14(5, [[6, 1], [6, 5], [10, 1], [10, 9]]);
  c14(6, [[7, 1], [7, 6], [9, 1], [9, 8]]); c14(7, [[8, 1], [8, 7]]);
  for (var c = 2; c <= 10; c++) m[13][c] = exR(m[14][c], m[14][c + 1]);
  var c13 = (c, t) => t.forEach(([r, k]) => m[r][k] = m[13][c]);
  c13(2, [[4, 2], [13, 11]]); c13(3, [[12, 2], [12, 10], [5, 2], [5, 3]]);
  c13(4, [[11, 2], [11, 9], [6, 4], [6, 2]]); c13(5, [[10, 2], [10, 8], [7, 5], [7, 2]]);
  c13(6, [[9, 2], [9, 7], [8, 6], [8, 2]]);
  for (var j = 3; j <= 8; j++) m[12][j] = exR(m[13][j], m[13][j+1]);
  var c12 = (c, t) => t.forEach(([r, k]) => m[r][k] = m[12][c]);
  c12(3, [[12, 9], [6, 3]]); c12(4, [[11, 3], [11, 8], [7, 4], [7, 3]]);
  c12(5, [[10, 3], [10, 7], [8, 5], [8, 3]]); c12(6, [[9, 3], [9, 6]]);
  m[11][4] = exR(m[12][4], m[12][5]); m[11][5] = exR(m[12][5], m[12][6]); m[11][6] = exR(m[12][6], m[12][7]);
  var c11 = (c, t) => t.forEach(([r, k]) => m[r][k] = m[11][c]);
  c11(4, [[11, 7], [8, 4]]); c11(5, [[10, 4], [10, 6], [9, 4], [9, 5]]);
  m[10][5] = exR(m[11][5], m[11][6]);
  return m;
}

function getColorMatrixRund(seed) {
  var s = (seed === 0 || !seed) ? 1 : seed;
  var shift = (s - 1) % 9;
  return baseColorsRund.slice(shift).concat(baseColorsRund.slice(0, shift));
}
